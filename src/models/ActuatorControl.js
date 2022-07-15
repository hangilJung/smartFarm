const axios = require("axios");
const DataAccess = require("./DataAccess");
const moment = require("moment");
const actu = require("../utils/actuator");
const fn = require("../lib/fn");
const nt = require("../lib/fnNutrient");
const dbfn = require("../lib/databaseAccessFn");
const logger = require("../config/logger");
const ds = require("../lib/detailSettingFunction");
const timeoutSettingValue = 10000;
const { io } = require("socket.io-client");
const url = require("../config/url");

const mainData = io(url.SOCKETIO_MAIN_DATA_SERVER_HOST, {
  transports: ["websocket"],
});

mainData.on("connect", () => {
  console.log(mainData.id);
  console.log(mainData.connected);
});

mainData.on("connect_error", (reason) => {
  console.log(reason);
});

class ActuatorControl {
  constructor(body) {
    this.body = body;
  }

  async simpleActuatorControl() {
    try {
      const { deviceName, active } = this.body;
      const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      const device = await actu.deviceList[deviceName];

      let finalResult;

      const ctrl = {
        farmland_id: 1,
        data: [
          {
            bed_id: 5,
            device,
            active,
            device_name: deviceName,
            datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
            dev_data: [],
          },
        ],
      };

      if (
        fn.parameterIsUndefinded(actu.activeList[active]) ||
        fn.isDeviceNameAndActive(deviceName, active)
      ) {
        return fn.invalidRequestParameterError();
      }

      const content = fn.createCharacter(deviceName, active);
      console.log(content);
      await DataAccess.actuatorControlActionRecord(deviceName, content);
      loadActuatorRecord();

      const result = await axios.post(process.env.GATEWAY_SERVER, ctrl, {
        timeout: timeoutSettingValue,
      });

      const resultCode = await result["data"]["header"]["resultCode"];

      if (result.data === undefined || resultCode == "10") {
        const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");
        return fn.communicationError("fan", reqDatetime, resDatetime);
      }

      if (active == "on") {
        if (resultCode == "00" && true) {
          await fn.sleep(3000).then(async () => {
            const result = await DataAccess.currentAmountOfChange();

            if (
              result[0][0]["sensor_data_value"] >
              fn.addCurrent(fn.deviceStatus())
            ) {
              fn.currentValueFsWrite(deviceName, "on");
              const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");
              finalResult = fn.simpleResultStatusNormal(
                reqDatetime,
                resDatetime,
                device
              );
            } else {
              const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");

              finalResult = fn.simpleResultStatusNotWorking(
                reqDatetime,
                resDatetime,
                device
              );
            }
            await DataAccess.actuatorControlActionRecord(
              deviceName,
              `${deviceName}작동에 통신 문제가 발생했습니다.`
            );
            loadActuatorRecord();
            return finalResult;
          });
        }
      } else if (active == "stop") {
        if (resultCode == "00" && true) {
          await fn.sleep(3000).then(async () => {
            const result = await DataAccess.currentAmountOfChange();
            const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

            if (
              result[0][0]["sensor_data_value"] <
              fn.addCurrentOff(fn.deviceStatus())
            ) {
              fn.currentValueFsWrite(deviceName, "off");
              finalResult = fn.simpleResultStatusNormal(
                reqDatetime,
                resDatetime,
                device
              );
            } else {
              const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");
              finalResult = fn.simpleResultStatusNotWorking(
                reqDatetime,
                resDatetime,
                device
              );
              await DataAccess.actuatorControlActionRecord(
                deviceName,
                `${deviceName}작동에 통신 문제가 발생했습니다.`
              );
              loadActuatorRecord();
            }
            return finalResult;
          });
        }
      }

      return finalResult;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function simpleActuatorControl() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.fanInvalidRequestParameterError();
    }
  }

  async simpleTest() {
    try {
      const { deviceName, active } = await this.body;
      const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      const device = await actu.deviceList[deviceName];
      let finalResult;

      const ctrl = {
        farmland_id: 1,
        data: [
          {
            bed_id: 5,
            device: device,
            active: active,
            device_name: deviceName,
            datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
            dev_data: [],
          },
        ],
      };

      if (
        fn.parameterIsUndefinded(actu.activeList[active]) ||
        fn.isDeviceNameAndActive(deviceName, active)
      ) {
        return fn.invalidRequestParameterError();
      }

      const result = await axios.post(process.env.GATEWAY_SERVER, ctrl);
      console.log(result.data);

      const fanStatus = await result.data.body.data[0].dev_data[0]["status"];

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      if (active === "on") {
        if (fanStatus === "on") {
          fn.currentValueFsWrite(deviceName, "on");

          finalResult = fn.simpleResultStatusNormal(
            reqDatetime,
            resDatetime,
            device
          );
        } else if (fanStatus === "off") {
          finalResult = fn.simpleResultStatusNotWorking(
            reqDatetime,
            resDatetime,
            device
          );
        }
      } else if (active === "stop") {
        if (fanStatus === "off") {
          fn.currentValueFsWrite(deviceName, "off");

          finalResult = fn.simpleResultStatusNormal(
            reqDatetime,
            resDatetime,
            device
          );
        } else if (fanStatus === "on") {
          finalResult = fn.simpleResultStatusNotWorking(
            reqDatetime,
            resDatetime,
            device
          );
        }
      }

      return finalResult;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function simpleTest() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.fanInvalidRequestParameterError();
    }
  }

  async fanStatus() {
    try {
      const fileRead = fn.currentValueFsRead();

      return {
        header: {
          resultCode: "00",
          resultMsg: "NORMAL_SERVICE",
        },
        body: [
          {
            device: "fan1",
            status: fileRead["fan1"]["status"],
          },
          {
            device: "fan2",
            status: fileRead["fan2"]["status"],
          },
          {
            device: "fan3",
            status: fileRead["fan3"]["status"],
          },
        ],
      };
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function fanStatus() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.fanInvalidRequestParameterError();
    }
  }
  async nutrientStop() {
    const dataFormat = fn.deliverDataFormatWrite(actu);
    const nowTime = moment().format("YYYY-MM-DD HH:mm:ss");
    let latelyTotalSupply;
    let line;
    let data;

    try {
      const content = fn.writeNutrientStopContent();

      // const result = await axios.post(process.env.GATEWAY_SERVER, dataFormat, {
      //   timeout: timeoutSettingValue,
      // });

      return fn.normalService();
    } catch (error) {
      return fn.invalidRequestParameterError();
    }
  }

  async loadActuatorRecord() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    const response = {
      header: {},
    };
    try {
      const result = await DataAccess.loadActionRecord();
      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      if (result[0].length > 0) {
        response.header = {
          resultCode: "00",
          resultMsg: "NORMAL_SERVICE",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        response.body = result[0];
      } else {
        response.header = {
          resultCode: "10",
          resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
      }

      nt.socketActionRecord(response);

      return response;
    } catch (error) {
      logger.error(
        `src/models/ActuatorControl.js function loadActuatorRecord() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async start() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const response = {
      header: {},
    };
    try {
      const ctrl = {
        farmland_id: 1,
        data: [
          {
            bed_id: 5,
            device: "nuctrl",
            active: "nctrl_write",
            device_name: "nutrient",
            datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
            dev_data: [actu.nutrient.act.run],
          },
        ],
      };
      console.log(ctrl);

      const result = await axios.post(process.env.GATEWAY_SERVER, ctrl);
      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");

        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      fn.currentValueFsWrite("nutrient", "on");

      if (result.data.header.resultCode == "00" && true) {
        await fn.sleep(3000).then(async () => {
          try {
            const result = await DataAccess.currentAmountOfChange();
            console.log(result[0][0]["sensor_data_value"]);
            const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
            if (
              result[0][0]["sensor_data_value"] >
              fn.addCurrent(fn.deviceStatus())
            ) {
              await DataAccess.actuatorControlActionRecord(
                "nutrient",
                "양액기가 공급을 시작합니다."
              );

              response.header = {
                resultCode: "00",
                resultMsg: "NORMAL_SERVICE",
                requestDatetime: reqDatetime,
                responseDatetime: resDatetime,
              };
              response.body = [{ device: "nutrient" }];
            } else {
              await DataAccess.actuatorControlActionRecord(
                "nutrient",
                "양액기 작동 명령에도 작동하지 않습니다."
              );

              response.header = {
                resultCode: "40",
                resultMsg: "NOT_WORKING",
                requestDatetime: reqDatetime,
                responseDatetime: resDatetime,
              };
              response.body = [{ device: "nutrient" }];
            }
          } catch (error) {
            console.log(error);
          }
        });
      }

      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function start() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async stop() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const ctrl = {
        farmland_id: 1,
        data: [
          {
            bed_id: 5,
            device: "nuctrl",
            active: "nctrl_write",
            device_name: "nutrient",
            datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
            dev_data: [actu.nutrient.act.stop],
          },
        ],
      };
      const result = await axios.post(process.env.GATEWAY_SERVER, ctrl);
      if (result.data === undefined) {
        return fn.communicationError("nutrient");
      }

      fn.currentValueFsWrite("nutrient", "off");
      if (result.data.header.resultCode == "00" && true) {
        await fn.sleep(2000).then(async () => {
          try {
            const result = await DataAccess.currentAmountOfChange();
            console.log(result[0][0]["sensor_data_value"]);
            const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
            if (
              result[0][0]["sensor_data_value"] <
              fn.addCurrent(fn.deviceStatus())
            ) {
              await DataAccess.actuatorControlActionRecord(
                "nutrient",
                "양액기가 공급을 중지합니다."
              );

              response.header = {
                resultCode: "00",
                resultMsg: "NORMAL_SERVICE",
                requestDatetime: reqDatetime,
                responseDatetime: resDatetime,
              };
              response.body = [{ device: "nutrient" }];
            } else {
              await DataAccess.actuatorControlActionRecord(
                "nutrient",
                "양액기 중지명령에도 중지하지 않습니다."
              );

              response.header = {
                resultCode: "40",
                resultMsg: "NOT_WORKING",
                requestDatetime: reqDatetime,
                responseDatetime: resDatetime,
              };
              response.body = [{ device: "nutrient" }];
            }
          } catch (error) {
            console.log(error);
          }
        });
      }

      // DataAccess.actuatorControlActionRecord(
      //   dataFormat.data[0]["deviceName"],
      //   content
      // );

      const nutrientLineSupplyResult = await DataAccess.nutrientLineSupply();

      for (let i of nutrientLineSupplyResult[0]) {
        if (i["total_supply"] !== null) {
          latelyTotalSupply = i["total_supply"];
          line = i["line"];
        }
      }

      const getDataNutrientTotalSupplyResult = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.whatLine(line)
      );

      const todaySupply = Number(
        getDataNutrientTotalSupplyResult.data[0].dev_data[0]["description"]
      );

      const supply = todaySupply - latelyTotalSupply;
      console.log(supply);

      await DataAccess.nutrientEndSupplyDatetime(supply, todaySupply, nowTime);
      const readNutrientSupplyResult = await DataAccess.readNutrientSupply();

      const startSupplyDatetime = moment(
        readNutrientSupplyResult[0][0]["start_supply_date_time"]
      );
      const endSupplyDatetime = moment(
        readNutrientSupplyResult[0][0]["end_supply_date_time"]
      );

      const matter = readNutrientSupplyResult[0][0]["matter"];

      if (startSupplyDatetime.format("HH") === endSupplyDatetime.format("HH")) {
        data = [
          {
            matter: matter,
            line: line,
            supply_date_time: nowTime,
            supply: supply,
          },
        ];
      } else {
        const minutePerLitter =
          supply /
          endSupplyDatetime.diff(moment(startSupplyDatetime), "minutes");

        data = fn.twoHourData(
          matter,
          line,
          startSupplyDatetime,
          endSupplyDatetime,
          minutePerLitter
        );
      }

      DataAccess.hourlyLineSupply(data);

      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function stop() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async databaseNutriculureMachineStatus() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    const response = {
      header: {},
    };

    try {
      const result = await DataAccess.nutricultureMachinePageStatusValue();

      if (result[0].length > 0) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        response.header = {
          resultCode: "00",
          resultMsg: "NORMAL_SERVICE",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        response.body = result[0];
      } else {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        response.header = {
          resultCode: "10",
          resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
      }

      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function databaseNutriculureMachineStatus() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return error;
    }
  }

  //nutricultureMachine 페이지 상태값들
  async nutricultureMachineStatus() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    const response = {
      header: {},
    };

    try {
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.readNutreint(actu.nutricultureMachine["list"]),
        { timeout: timeoutSettingValue }
      );

      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      if (result.data["resultCode"] == "10" || result === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        response.header = {
          resultCode: "10",
          resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        response.body = [{ device: "nutrient" }];

        return response;
      }

      const getData = await result.data?.body["data"][0]["dev_data"];

      const processData = getData.map((data) => {
        if (
          data["modbus_address"] == "44105" ||
          data["modbus_address"] == "44106" ||
          data["modbus_address"] == "44360" ||
          data["modbus_address"] == "44361" ||
          data["modbus_address"] == "44362" ||
          data["modbus_address"] == "44363" ||
          data["modbus_address"] == "44380" ||
          data["modbus_address"] == "44381" ||
          data["modbus_address"] == "44382" ||
          data["modbus_address"] == "44383"
        ) {
          return {
            address: data.modbus_address,
            value: String(Number(data.description) / 1000),
          };
        } else {
          return { address: data.modbus_address, value: data.description };
        }
      });

      for (let i of processData) {
        if (i.address == "10096") {
          if (i.value == "0") {
            fn.currentValueFsWrite("nutrient", "off");
          } else if (i.value == "1") {
            fn.currentValueFsWrite("nutrient", "on");
          }
          break;
        }
      }
      //양액기 페이지 상태 값 insert 문
      // DataAccess.test(processData);
      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      response.header = {
        resultCode: "00",
        resultMsg: "NORMAL_SERVICE",
        requestDatetime: reqDatetime,
        responseDatetime: resDatetime,
      };
      response.body = processData;
      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function nutricultureMachineStatus() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async sendToFrontNutrienNewtData() {
    try {
      const nutrientData = await this.nutricultureMachineStatus();

      const dbData = await DataAccess.nutricultureMachinePageStatusValue();
      const bodyData = await nutrientData["body"];
      const compareResult =
        await dbfn.compareNutricultureMachinePageStatusValue(
          bodyData,
          dbData[0]
        );

      if (compareResult.list?.length ?? -1 > 0) {
        nt.sendToNutricultureMachinePageSocket(
          nt.whatDetailNumber(compareResult.list),
          bodyData
        );
        await DataAccess.updateNutricultureMachinePageStatus(
          compareResult.list
        );
      }

      return;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function sendToFrontNutrienNewtData() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return error;
    }
  }

  async controlMode() {
    const { what } = this.body;

    if (what == "easy") {
      return this.easySelection();
    } else if (what == "detail") {
      return this.detailSelection();
    }
  }

  async easySelection() {
    try {
      const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint([
          {
            modbus_address: "44400",
            description: "0",
            property: "write",
          },
        ]),
        {
          timeout: timeoutSettingValue,
        }
      );
      const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");

      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      this.sendToFrontNutrienNewtData();

      return fn.nutrientStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function easySelection() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async detailSelection() {
    try {
      const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint([
          {
            modbus_address: "44400",
            description: "1",
            property: "write",
          },
        ]),
        {
          timeout: timeoutSettingValue,
        }
      );
      const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");
      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      this.sendToFrontNutrienNewtData();

      return fn.nutrientStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function detailSelection() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async easySetting() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      if (nt.invalidEasySetting(this.body)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.easySetting(this.body)),
        {
          timeout: timeoutSettingValue,
        }
      );

      const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");
      console.log(result.data);
      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      this.sendToFrontNutrienNewtData();

      return fn.nutrientStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function easySetting() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async detailSettingTime() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const { where, hour, minute } = this.body;
    try {
      if (nt.invalidWhere(where) || nt.invalidHourMinute(hour, minute)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.detailHourMinute(where, hour, minute)),
        {
          timeout: timeoutSettingValue,
        }
      );
      const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");
      console.log(result.data);
      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      this.sendToFrontNutrienNewtData();

      return fn.nutrientStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function detailSettingTime() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async detailSettingMatter() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const { where, matter } = this.body;
    try {
      if (nt.invalidWhere(where) || nt.invalidBinary(matter)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.detailMatter(where, matter)),
        {
          timeout: timeoutSettingValue,
        }
      );
      const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");
      console.log(result.data);
      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      this.sendToFrontNutrienNewtData();

      return fn.nutrientStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function detailSettingMatter() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError();
    }
  }

  async detailSettingIsUse() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const { where, isUse } = this.body;
    try {
      if (nt.invalidWhere(where) || nt.invalidBinary(isUse)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.detailIsUse(where, isUse)),
        {
          timeout: timeoutSettingValue,
        }
      );
      const resDatetime = moment().format("YYYY-MM-DD  HH:mm:ss");
      console.log(result.data);
      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      this.sendToFrontNutrienNewtData();

      return fn.nutrientStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function detailSettingIsUse() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async detailSettingTrayIsUse() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const { where, tray, isUse } = this.body;
    console.log(this.body);

    try {
      if (
        nt.invalidWhere(where) ||
        nt.invalidTray(tray) ||
        nt.invalidBinary(isUse)
      ) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.detailTrayIsUse(where, tray, isUse)),
        {
          timeout: timeoutSettingValue,
        }
      );
      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      console.log(result.data);
      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      this.sendToFrontNutrienNewtData();

      return fn.nutrientStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function detailSettingTrayIsUse() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async detailSupplySetting() {
    const { tray, minute, second } = this.body;
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      if (
        nt.invalidTray(tray) ||
        nt.invalidSupplyMinuteSecond(minute, second)
      ) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.detailSupplySetting(tray, minute, second)),
        {
          timeout: timeoutSettingValue,
        }
      );
      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      console.log(result.data);
      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      this.sendToFrontNutrienNewtData();

      return fn.nutrientStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function detailSupplySetting() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async ecPhSetting() {
    const { tray, what, value } = this.body;
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      if (nt.invalidTray(tray) || nt.invalidEcPh(what, value)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.EcPhSetting(tray, what, value)),
        {
          timeout: timeoutSettingValue,
        }
      );
      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      console.log(result.data);
      if (result.data === undefined) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.communicationError("nutrient", reqDatetime, resDatetime);
      }

      this.sendToFrontNutrienNewtData();

      return fn.nutrientStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function ecPhSetting() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async detailSetting() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      if (ds.invalidDetailSettingData(this.body)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      //테스트
      logger.info(`상세 설정 파라미터 : ${JSON.stringify(this.body)}`);
      logger.info(
        `상세 설정 ${JSON.stringify(ds.filteringDetailSettingData(this.body))}`
      );
      //테스트
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(ds.filteringDetailSettingData(this.body)),
        {
          timeout: timeoutSettingValue,
        }
      );

      this.sendToFrontNutrienNewtData();
      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.nutrientStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/ActuatorControl.js function detailSetting() error : ${
          error ?? "not load error contents"
        }`
      );
      if (error?.code === "ECONNABORTED") {
        return fn.timeOutError();
      }
      return fn.invalidRequestParameterError();
    }
  }

  async test() {
    try {
      const result = await DataAccess.readNutrientSupply();

      console.log(result[0]);

      const startSupplyDatetime = moment(result[0][0].start_supply_date_time);
      const endSupplyDatetime = moment(result[0][0].end_supply_date_time);

      console.log(startSupplyDatetime, endSupplyDatetime);

      if (startSupplyDatetime.format("HH") === endSupplyDatetime.format("HH")) {
        console.log("시간은 ", startSupplyDatetime.format("HH"));
        console.log(
          "분은 ",
          endSupplyDatetime.diff(startSupplyDatetime, "minutes")
        );

        console.log(
          "12312312",
          endSupplyDatetime.diff(moment(startSupplyDatetime), "minutes")
        );
      } else {
        console.log(
          moment(endSupplyDatetime.format("YYYY-MM-DD HH:00:00")).diff(
            startSupplyDatetime,
            "minutes"
          )
        );
        console.log(
          endSupplyDatetime.diff(
            moment(endSupplyDatetime.format("YYYY-MM-DD HH:00:00")),
            "minutes"
          )
        );
      }

      return result[0];
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ActuatorControl;
