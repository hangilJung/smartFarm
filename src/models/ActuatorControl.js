const axios = require("axios");
const DataAccess = require("./DataAccess");
const moment = require("moment");
const actu = require("../utils/actuator");
const headerStatusCode = require("../utils/headerStatusCode.js");
const fn = require("../lib/fn");
const nt = require("../lib/fnNutrient");
const { io } = require("socket.io-client");
const dbfn = require("../lib/databaseAccessFn");

const nutrient = io(process.env.SOCKETIO_NUTRIENT_DATA_SERVER_HOST, {
  transports: ["websocket"],
});

nutrient.on("connect", () => {
  console.log(nutrient.id);
  console.log(nutrient.connected);
});

nutrient.on("connect_error", (reason) => {
  console.log(reason);
});

nutrient.on("disconnect", (reason) => {
  console.log(reason);
  console.log("disconnect");
});

class ActuatorControl {
  constructor(body) {
    this.body = body;
  }
  // String deviceName   fan1, fan2, fan3
  // String active   on, stop, open, close
  async simpleActuatorControl() {
    const { deviceName, active } = this.body;

    const device = actu.deviceList[deviceName];

    const ctrl = {
      farmlandId: 1,
      data: [
        {
          bedId: 5,
          device,
          active,
          device_name: deviceName,
          dev_data: [],
          datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
        },
      ],
    };

    console.log(ctrl);

    if (fn.parameterIsUndefinded(actu.activeList[active])) {
      return fn.invalidRequestParameterError();
    }

    try {
      const content = fn.createCharacter(deviceName, active);
      console.log(content);
      DataAccess.actuatorControlActionRecord(deviceName, content);
      const result = await axios.post(process.env.GATEWAY_SERVER, ctrl);

      return result.data;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  // String matter  water, fertilizer
  // Number line    1,2,3,4

  async nutrientSupply() {
    const { matter, line } = this.body;
    const response = {
      header: {},
    };
    const nowTime = moment().format("YYYY-MM-DD T HH:mm:ss");

    if (
      fn.isNutrientSupplyFnParamsAValid(matter, line) ||
      fn.isUndefinedParams(matter, line)
    ) {
      return fn.invalidRequestParameterError();
    }

    const ctl = {
      farmlandId: 1,
      data: [
        {
          bedId: 5,
          device: "nuctrl",
          active: "nuctrl_write",
          deviceName: "nutrient",
          dev_data: fn.whereToSupply(matter, line),
          datetime: nowTime,
        },
      ],
    };

    try {
      const content = fn.writeNutrientSupplyContent(matter, line);

      const result = await axios.post(process.env.GATEWAY_SERVER, ctl);
      DataAccess.actuatorControlActionRecord(ctl.deviceName, content);
      DataAccess.nutrientStartSupplyDatetime(matter, line, nowTime);

      console.log(result);

      if (result.header.resultCode === "00") {
        response.header = headerStatusCode.normalService;
      } else {
        response.header = headerStatusCode.invalidRequestParameterError;
      }

      return response;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async nutrientStop() {
    const dataFormat = fn.deliverDataFormatWrite(actu);
    const nowTime = moment().format("YYYY-MM-DD T HH:mm:ss");
    let latelyTotalSupply;
    let line;
    let data;

    try {
      const content = fn.writeNutrientStopContent();

      const result = await axios.post(process.env.GATEWAY_SERVER, dataFormat);
      DataAccess.actuatorControlActionRecord(
        dataFormat.data[0]["deviceName"],
        content
      );
      const nutrientLineSupplyResult = await DataAccess.nutrientLineSupply();

      for (let i of nutrientLineSupplyResult[0]) {
        if (i["total_supply"] !== null) {
          latelyTotalSupply = i["total_supply"];
          line = i["line"];
        }
      }

      // const getDataNutrientTotalSupplyResult = await axios.post(
      //   process.env.GATEWAY_SERVER,
      //   fn.whatLine(line)
      // );

      // const todaySupply = Number(
      //   getDataNutrientTotalSupplyResult.data[0].dev_data[0]["description"]
      // );

      // const supply = todaySupply - latelyTotalSupply;
      // console.log(supply);

      // await DataAccess.nutrientEndSupplyDatetime(supply, todaySupply, nowTime);
      // const readNutrientSupplyResult = await DataAccess.readNutrientSupply();

      // const startSupplyDatetime = moment(
      //   readNutrientSupplyResult[0][0]["start_supply_date_time"]
      // );
      // const endSupplyDatetime = moment(
      //   readNutrientSupplyResult[0][0]["end_supply_date_time"]
      // );

      // const matter = readNutrientSupplyResult[0][0]["matter"];

      // if (startSupplyDatetime.format("HH") === endSupplyDatetime.format("HH")) {
      //   data = [
      //     {
      //       matter: matter,
      //       line: line,
      //       supply_date_time: nowTime,
      //       supply: supply,
      //     },
      //   ];
      // } else {
      //   const minutePerLitter =
      //     supply /
      //     endSupplyDatetime.diff(moment(startSupplyDatetime), "minutes");

      //   data = fn.twoHourData(
      //     matter,
      //     line,
      //     startSupplyDatetime,
      //     endSupplyDatetime,
      //     minutePerLitter
      //   );
      // }

      // DataAccess.hourlyLineSupply(data);
      return fn.normalService();
    } catch (error) {
      return fn.invalidRequestParameterError();
    }
  }

  async readNutrient() {
    const { wantData } = this.body;

    const dataFormat = fn.deliverDataFormatRead(wantData);
    try {
      const result = await axios.post(process.env.GATEWAY_SERVER, dataFormat);

      return result;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async emergency() {
    this.nutrientStop();

    const response = {
      header: {},
    };
    const ctrl = actu.emergency;

    try {
      const content = fn.emergencyContent();

      DataAccess.actuatorControlActionRecord(ctrl.deviceName, content);
      DataAccess.actuatorStatusZero();

      // const result = await axios.post(proccess.env.GATEWAY_SERVER, ctl);

      // if (result.header.resultCode === "00") {
      response.header = headerStatusCode.normalService;
      // } else {
      // response.header = headerStatusCode.invalidRequestParameterError;
      // }

      return response;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async loadActuatorRecord() {
    const response = {
      header: {},
    };
    try {
      const result = await DataAccess.loadActionRecord();

      if (result[0].length > 0) {
        response.header = headerStatusCode.normalService;
        response.body = result[0];
      } else {
        response.header = headerStatusCode.invalidRequestParameterError;
      }

      return response;
    } catch (error) {
      return fn.invalidRequestParameterError();
    }
  }

  async loadNutrientData() {
    let response;

    try {
      // const result = await axios.post(
      //   process.env.GATEWAY_SERVER,
      //   fn.readNutreint(actu.readNutrientDataDigitalAndAnalog["list"])
      // );
      console.log(result.data);
      // if (result.data.header.resultCode === "00") {
      //   response = fn.responseHeaderAndBody(result.data.body);
      // } else {
      //   response = fn.invalidRequestParameterError();
      // }

      return result.data;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async start() {
    try {
      // const result = await axios.post(
      //   process.env.GATEWAY_SERVER,
      //   fn.writeNutreint(actu.nutrient.act.run)
      // );

      // return result.data;
      return "1회 관수 성공";
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async stop() {
    try {
      // const result = await axios.post(process.env.GATEWAY_SERVER, ctrl);

      // return result.data;
      return "정지 성공";
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  //nutricultureMachine 페이지 상태값들
  async nutricultureMachineStatus() {
    const response = {
      header: {},
    };
    try {
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.readNutreint(actu.nutricultureMachine["list"]),
        { timeout: 1500 }
      );

      const getData = await result.data.body["data"][0]["dev_data"];

      const processData = getData.map((data) => {
        return { address: data.modbus_address, value: data.description };
      });

      // DataAccess.test(processData);
      response.header = headerStatusCode.normalService;
      response.body = processData;

      return response;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async sendToFrontNutrienNewtData() {
    try {
      const nutrientData = await this.nutricultureMachineStatus();
      const dbData = await DataAccess.nutricultureMachinePageStatusValue();
      const bodyData = await nutrientData["body"];
      if (
        await dbfn.compareNutricultureMachinePageStatusValue(
          bodyData,
          dbData[0]
        )
      ) {
        if (bodyData.length > 0) {
          nutrient.emit("getNutrientData", bodyData);
        } else {
          nutrient.emit(
            "getNutrientData",
            "{resultCode: 05, resultMsg: SERVICE_TIME_OUT}"
          );
        }
      }
      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async easySelection() {
    try {
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint([
          {
            modbus_address: "44400",
            description: "0",
            property: "write",
          },
        ])
      );

      console.log(result.data);

      return result.data;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async detailSelection() {
    try {
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint([
          {
            modbus_address: "44400",
            description: "1",
            property: "write",
          },
        ])
      );

      console.log(result.data);

      return result.data;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async easySetting() {
    try {
      console.log(nt.easySetting(this.body));
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.easySetting(this.body))
      );

      console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async detailSettingTime() {
    const { where, hour, minute } = this.body;
    try {
      console.log(nt.detailHourMinute(where, hour, minute));
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.detailHourMinute(where, hour, minute))
      );

      console.log(result.data);

      return result.data;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async detailSettingMatter() {
    const { where, matter } = this.body;
    try {
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.detailMatter(where, matter))
      );

      console.log(result.data);

      return result.data;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async detailSettingIsUse() {
    const { where, isUse } = this.body;
    try {
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.detailIsUse(where, isUse))
      );
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async detailSettingTrayIsUse() {
    const { where, tray, isUse } = this.body;

    try {
      const result = await axios.post(
        process.env.GATEWAY_SERVER,
        fn.writeNutreint(nt.detailTrayIsUse(where, tray, isUse))
      );
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error);
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
