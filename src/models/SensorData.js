const DataAccess = require("./DataAccess");
const moment = require("moment");
const fn = require("../lib/fn");
const daFn = require("../lib/databaseAccessFn");
const io = require("../utils/io");
const logger = require("../config/logger");
const axios = require("axios");
const schedule = require("node-schedule");
const ActuatorControl = require("./ActuatorControl");

class SensorData {
  constructor(body) {
    this.body = body;
  }

  async #trycatch(a, reqDatetime) {
    try {
      const result = await a;
      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        result[0],
        reqDatetime,
        resDatetime
      );
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function trycatch() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError();
    }
  }

  #getDate() {
    let { startDate, endDate } = this.body;

    endDate = fn.addEndDate(endDate);

    return { startDate, endDate };
  }

  async saveSensorData() {
     try {
     axios.post(process.env.TEST_LOCAL_SERVER, this.body);
     } catch (error) {
       console.log(error);
     }
    const insertDate = moment().format("YYYY-MM-DD HH:mm:ss");
    // console.log(this.body);
    logger.debug(JSON.stringify(this.body));
    try {
      const getSensorDataRange = await DataAccess.getSensorDataRange();
      const filteringData = daFn.checkDataValidation(
        this.body,
        getSensorDataRange,
        insertDate
      );
      const id = fn.findSensorInformationId(filteringData);

      await DataAccess.saveDate(insertDate, id);

      const result = await DataAccess.saveSensorData(filteringData, insertDate);

      const agoSensorData = await DataAccess.loadAFewMinutesAgoSensorData();

      if (await daFn.compareMainSensorData(filteringData, agoSensorData)) {
        const data = fn.pickUpInsideData(filteringData, insertDate);
        console.log("?????? ?????? ????????? ??????");
        const response = {
          header: {
            resultCode: "00",
            resultMsg: "NORMAL_SERVICE",
          },
          body: data,
        };
        io.mainData.emit("insideSensorData", response);

        console.log(data);
      }

      if (await daFn.compareOutsideSensorData(filteringData, agoSensorData)) {
        const data = fn.pickUpOutsideData(filteringData, insertDate);
        console.log("?????? ?????? ????????? ??????");
        const response = {
          header: {
            resultCode: "00",
            resultMsg: "NORMAL_SERVICE",
          },
          body: data,
        };
        io.mainData.emit("outsideSensorData", response);
        console.log(data);
      }

      return fn.normalService();
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function saveSensorData() error : ${
          error ?? "not load error contents"
        }`
      );

      return fn.invalidRequestParameterError();
    }
  }

  async loadLatelySensorData() {
    try {
      const result = await DataAccess.loadLatelySensorData();

      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        result
      );
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function loadLatelySensorData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError();
    }
  }

  async mainInsideSensorData() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const result = await DataAccess.mainInsideSensorData();

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      const transResult = fn.transDecimalAndIntegerMainInsideSensorData(result);

      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        transResult,
        reqDatetime,
        resDatetime
      );
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function mainInsideSensorData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError();
    }
  }

  async mainOutsideSensorData() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const result = await DataAccess.mainOutsideSensorData();

      const transResult =
        fn.transDecimalAndIntegerMainOutsideSensorData(result);

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        transResult,
        reqDatetime,
        resDatetime
      );
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function mainOutsideSensorData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError();
    }
  }

  async readBedData() {
    const response = {
      header: {},
    };
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const result = await DataAccess.readBedData();
      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      if (fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "00",
          resultMsg: "NORMAL_SERVICE",
          reqDatetime,
          resDatetime,
        };
        response.body = result[0];
      } else if (!fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "02",
          resultMsg: "NO_DATA_ERROR",
          reqDatetime,
          resDatetime,
        };
      }

      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function readBedData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError();
    }
  }

  async updateSensorSettingValue() {
    const { sensorName, settingValue } = this.body;

    try {
      const result = await DataAccess.updateSensorSettingValue(
        settingValue,
        sensorName
      );

      return fn.hasItbeenUpdated(result);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function updateSensorSettingValue() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError();
    }
  }

  async loadMinutesSensorData() {
    const { startDate, endDate } = this.#getDate();
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    return this.#trycatch(
      DataAccess.loadMinutesSensorData(startDate, endDate),
      reqDatetime
    );
  }

  async loadHoursSensorData() {
    const { what } = this.body;
    const settingDate = moment()
      .subtract(5, "hours")
      .format("YYYY-MM-DD HH:mm:ss");
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const { id1, id2 } = fn.hoursSensorDataFilter(what);

    if (what === "co2") {
      return this.#trycatch(
        DataAccess.loadHoursCo2SensorData(settingDate, id1),
        reqDatetime
      );
    } else if (
      what == "temperature" ||
      what == "humidity" ||
      what == "insolation"
    ) {
      return this.#trycatch(
        DataAccess.loadHoursSensorData(settingDate, id1, id2),
        reqDatetime
      );
    } else {
      return fn.invalidRequestParameterError();
    }
  }

  async loadDaysSensorData() {
    const { startDate, endDate } = this.#getDate();
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    return this.#trycatch(
      DataAccess.loadDaysSensorData(startDate, endDate, reqDatetime)
    );
  }

  async loadMonthsSensorData() {
    const { startDate, endDate } = this.#getDate();
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    return this.#trycatch(
      DataAccess.loadMonthsSensorData(startDate, endDate, reqDatetime)
    );
  }

  async loadYearsSensorData() {
    const { startDate, endDate } = this.#getDate();
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    return this.#trycatch(
      DataAccess.loadYearsSensorData(startDate, endDate, reqDatetime)
    );
  }

  async hourConsumptionData() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const result = await DataAccess.hourConsumptionData();

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.normalServiceAndNoDataError(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function hourConsumptionData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async dayConsumptionData() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const result = await DataAccess.dayConsumptionData();
      const maxResult = await DataAccess.dayMaxValue();

      let list = [];

      for (let i of result[0]) {
        list.push({ value: i.value, created_at: i.created_at });
      }
      for (let i of maxResult[0]) {
        list.push({ max_value: i.value, created_at: i.created_at });
      }
      const finalResult = [list];
      console.log(finalResult);
      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.normalServiceAndNoDataError(
        finalResult,
        reqDatetime,
        resDatetime
      );
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function dayConsumptionData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async dayMaxValue() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const result = await DataAccess.dayMaxValue();

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.normalServiceAndNoDataError(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function dayConsumptionData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }
  async monthConsumptionData() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const result = await DataAccess.monthConsumptionData();

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.normalServiceAndNoDataError(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function monthConsumptionData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async yearConsumptionData() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const result = await DataAccess.yearConsumptionData();

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.normalServiceAndNoDataError(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function yearConsumptionData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async accumulateConsumptionData() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const result = await DataAccess.accumulateConsumptionData();

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      const response = fn.normalServiceIncludBody(
        result,
        reqDatetime,
        resDatetime
      );

      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function accumulateConsumptionData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async statisticsConsumptionData() {
    const { what, startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    let result;

    try {
      if (fn.dateChecker(startDate, endDate)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }
      if (what == "hour") {
        result = await DataAccess.hourlyConsumptionData(startDate, endDate);
      } else if (what == "day") {
        result = await DataAccess.dailyConsumptionData(startDate, endDate);
      } else if (what == "month") {
        result = await DataAccess.monthlyConsumptionData(startDate, endDate);
      } else if (what == "year") {
        result = await DataAccess.yearlyConsumptionData(startDate, endDate);
      } else {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      const response = fn.normalServiceIncludBodyProcedure(
        result,
        reqDatetime,
        resDatetime
      );

      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function statisticsConsumptionData() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async sensorDataMinutely() {
    const { startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      if (fn.dateChecker(startDate, endDate)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const result = await DataAccess.sensorDataMinutely(startDate, endDate);

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.statisticsStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function sensorDataMinutely() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async sensorDataHourly() {
    const { startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log("endDate : ", endDate);
    try {
      if (fn.dateChecker(startDate, endDate)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const result = await DataAccess.sensorDataHourly(startDate, endDate);

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.procedureResultStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function sensorDataHourly() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async sensorDataDaily() {
    const { startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      if (fn.dateChecker(startDate, endDate)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const result = await DataAccess.sensorDataDaily(startDate, endDate);

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.procedureResultStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function sensorDataDaily() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async sensorDataMonthly() {
    const { startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      if (fn.dateChecker(startDate, endDate)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const result = await DataAccess.sensorDataMonthly(startDate, endDate);

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.procedureResultStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function sensorDataMonthly() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async sensorDataYearly() {
    const { startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      if (fn.dateChecker(startDate, endDate)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const result = await DataAccess.sensorDataYearly(startDate, endDate);

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.procedureResultStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function sensorDataYearly() error : ${
          error ?? "not load error contents"
        }`
      );
      return fn.invalidRequestParameterError;
    }
  }

  async socketConsumptionHourData() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const today = moment();
    const startDate = today.format("YYYY-MM-DD 00:00:00");
    const endDate = today.format("YYYY-MM-DD 23:59:59");
    try {
      const result = await DataAccess.hourlyConsumptionData(startDate, endDate);

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      const response = fn.normalServiceIncludBody(
        result,
        reqDatetime,
        resDatetime
      );
      io.mainData.emit("consumptionHourData", response);

      return;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function socketConsumptionHourData() error : ${
          error ?? "not load error contents"
        }`
      );
      return;
    }
  }

  async socketConsumptionAccumulatedDayData() {
    try {
      const result = await this.dayConsumptionData();

      io.mainData.emit("consumptionAccumulatedDayData", result);

      return;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function socketConsumptionDayData() error : ${
          error ?? "not load error contents"
        }`
      );
      return;
    }
  }

  async socketBedData() {
    try {
      const result = await this.readBedData();

      io.mainData.emit("bedData", result);
      return;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function socketBedData() error : ${
          error ?? "not load error contents"
        }`
      );
      return;
    }
  }

  async detectSensorData() {
    try {
      const result = await DataAccess.detectSensorData();
      const isData = fn.insertNull(fn.noId(result[0]));
      logger.info(JSON.stringify(isData));

      if (isData["saveDataList"].length > 0) {
        DataAccess.saveSensorDataSensorInformationId(
          isData["saveDataList"],
          isData["time"]
        );
        logger.info(JSON.stringify(isData["saveDataList"]));
        logger.info(JSON.stringify(isData["time"]));
        logger.info("save sensor data to detectSensorData");
      }
      return "success";
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function detectSensorData() error : ${
          error ?? "not load error contents"
        }`
      );
    }
  }

  async setAction() {
    try {
      const response = {
        header: {},
      };
      const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      console.log("!!!!", JSON.stringify(this.body));
      if (fn.invalidActionSettingValue(this.body)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }
      const list = fn.selectActionData(this.body);

      for (let i of list) {
        fn.writeActionStatus(i["where"], i["value"]);
      }

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      response.header = {
        resultCode: "00",
        resultMsg: "NORMAL_SERVICE",
        requestDatetime: reqDatetime,
        responseDatetime: resDatetime,
      };
      const data = await this.readAction();
      console.log(data);
      io.mainData.emit("actionSettingValue", data);

      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function setActionFsWrite() error : ${
          error ?? "not load error contents"
        }`
      );
    }
  }

  async readAction() {
    try {
      const response = {
        header: {},
      };
      const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      let sensorData = fn.readActionStatus();

      response.header = {
        resultCode: "00",
        resultMsg: "NORMAL_SERVICE",
        requestDatetime: reqDatetime,
        responseDatetime: resDatetime,
      };
      response.body = sensorData;

      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function setAction() error : ${
          error ?? "not load error contents"
        }`
      );
    }
  }

  async actionLogic() {
    try {
      //?????? ?????? ??? ?????? ????????? ?????????
      const nowTime = moment().format("HH:00");
      // ?????????
      const detectStatus = fn.detectStatusFsRead();
      //???????????? ?????? ??????
      const timeNameList = [
        "num0Time",
        "num1Time",
        "num2Time",
        "num3Time",
        "num4Time",
        "num5Time",
        "num6Time",
        "num7Time",
        "num8Time",
        "num9Time",
        "num10Time",
        "num11Time",
        "num12Time",
        "num13Time",
        "num14Time",
        "num15Time",
        "num16Time",
        "num17Time",
        "num18Time",
        "num19Time",
        "num20Time",
        "num21Time",
        "num22Time",
        "num23Time",
      ];
      const result = fn.readActionStatus();

      //?????? ??? ?????? ?????? ?????? ????????? ????????????
      const sensorData = await DataAccess.detectAction();

      let sensorDataList = {};
      let shutterSchedule;

      //?????? ??? ?????? ?????? ?????? ??? ????????????
      for (let i of sensorData[0]) {
        if (i["sensor_name"] === "outTemp") {
          sensorDataList = {
            ...sensorDataList,
            outTemp: i["sensor_data_value"],
          };
        } else if (i["sensor_name"] === "outHumi") {
          sensorDataList = {
            ...sensorDataList,
            outHumi: i["sensor_data_value"],
          };
        } else if (i["sensor_name"] === "ws") {
          sensorDataList = { ...sensorDataList, ws: i["sensor_data_value"] };
        } else if (i["sensor_name"] === "rf") {
          sensorDataList = { ...sensorDataList, rf: i["sensor_data_value"] };
        } else if (i["sensor_name"] === "outInsol") {
          sensorDataList = {
            ...sensorDataList,
            outInsol: i["sensor_data_value"],
          };
        } else if (i["sensor_name"] === "co2Temp") {
          sensorDataList = {
            ...sensorDataList,
            co2Temp: i["sensor_data_value"],
          };
        } else if (i["sensor_name"] === "co2Humi") {
          sensorDataList = {
            ...sensorDataList,
            co2Humi: i["sensor_data_value"],
          };
        } else if (i["sensor_name"] === "inInsol") {
          sensorDataList = {
            ...sensorDataList,
            inInsol: i["sensor_data_value"],
          };
        }
      }

      console.log(sensorDataList);

      let settingList = {};

      //?????? ?????? ??? ????????????
      for (let i of timeNameList) {
        if (result[i] != "") {
          if (result[i] == nowTime) {
            let where;
            if (Number(nowTime.split(":")[0]) > 9) {
              where = i.slice(0, 5);
            } else {
              where = i.slice(0, 4);
            }

            const temp = where + "Temperature";

            const tempMin = result[temp].split("-")[0];
            const tempMax = result[temp].split("-")[1];

            settingList = { settingTempMin: tempMin, settingTempMax: tempMax };
            break;
          }
        }
      }

      console.log(settingList);
      let stage2Timer = false;

      const sub =
        Number(sensorDataList["co2Temp"]) -
        Number(settingList["settingTempMax"]);
      console.log(`sub ??????? ${sub.toFixed(1)}`);

      if (sub.toFixed(1) > Number(detectStatus['fanLevel1'])) {
        fn.detectFsWrite("isLoop", false);

        const { month, day, hour, minute, second } = fn.endTime(
          detectStatus["delay"]
        );

        schedule.scheduleJob(
          `${second} ${minute} ${hour} ${day} ${month} *`,
          async () => {
            const reSensorData = await DataAccess.detectAction();
            let co2Temp;

            for (let i of reSensorData[0]) {
              if (i["sensor_name"] === "co2Temp") {
                co2Temp = i["sensor_data_value"];
              }
            }

            const reSub =
              Number(co2Temp) - Number(settingList["settingTempMax"]);

            console.log("????????? ????????? ??????");
            if (reSub.toFixed(1) > Number(detectStatus['fanLevel1'])) {
              //?????????
              if (sub.toFixed(1) > Number(detectStatus["fanLevel3"])) {
                ///????????? ????????? ?????? ?????? ??????
                if (detectStatus["fanStatus"] === "") {
                  stage2Timer = true;

                  const actuatorControl = new ActuatorControl({
                    deviceName: "oneTwoThree",
                    active: "on",
                  });

                  actuatorControl.simpleActuatorControl();

                  console.log("????????? 1,2,3??? ???????????? 3?????? ????????? ??????");
                } else if (detectStatus["fanStatus"] === "1") {
                  console.log("????????? 1,3??? ???????????? 2?????? ????????? ??????");
                  const actuatorControl = new ActuatorControl({
                    deviceName: "oneThree",
                    active: "on",
                  });
                  actuatorControl.simpleActuatorControl();
                } else if (detectStatus["fanStatus"] === "2") {
                  const actuatorControl = new ActuatorControl({
                    deviceName: "fan3",
                    active: "on",
                  });
                  actuatorControl.simpleActuatorControl();
                  console.log("????????? 3??? ???????????? 1?????? ????????? ??????");
                } else if (detectStatus["fanStatus"] === "3") {
                  console.log("????????? ??????????????? ?????? ?????? ????????? ??????");
                }

                // detectStatus ?????? isLoop ???????????? false??? ??????
                fn.detectFsWrite("fanStatus", "3");
                fn.detectFsWrite("isLoop", false);

                const { month, day, hour, minute, second } = fn.endTime(
                  detectStatus["coolTime"]
                );

                console.log("???????????? ??????", minute, ":", second);

                schedule.scheduleJob(
                  `${second} ${minute} ${hour} ${day} ${month} *`,
                  () => {
                    console.log("?????? 3 ????????? ??????");

                    if (sensorDataList.co2Temp < settingList.settingTempMax) {
                      //????????? ?????? ?????? ??????
                      // detectStatus?????? level??? "" ?????? ??????
                      fn.detectFsWrite("fanStatus", "");

                      console.log("?????? ????????? ????????? ????????? ??????");

                      const actuatorControl = new ActuatorControl({
                        deviceName: "oneTwoThree",
                        active: "stop",
                      });
                      actuatorControl.simpleActuatorControl();

                      const { month, day, hour, minute, second } = fn.endTime(
                        detectStatus["coolTime"]
                      );

                      console.log(
                        "????????????",
                        moment().format("YYYY-MM-DD HH:mm:ss")
                      );
                      console.log(
                        `??????????????? ??????????????? ??????${minute}:${second}`
                      );

                      schedule.scheduleJob(
                        `${second} ${minute} ${hour} ${day} ${month} *`,
                        () => {
                          //????????? true ??????
                          fn.detectFsWrite("isLoop", true);

                          console.log("????????? true ?????? ????????? ??????");
                        }
                      );
                    } else {
                      fn.detectFsWrite("isLoop", true);

                      console.log("????????? true ?????? ????????? ??????");
                    }
                  }
                );
              } else if (sub.toFixed(1) > Number(detectStatus["fanLevel2"])) {
                //????????? ????????? ?????? ?????? ??????
                if (detectStatus["level"] === "") {
                  stage2Timer = true;
                  const actuatorControl = new ActuatorControl({
                    deviceName: "oneTwo",
                    active: "on",
                  });
                  actuatorControl.simpleActuatorControl();
                  console.log("????????? 1,2??? ???????????? 2?????? ????????? ??????");
                } else if (detectStatus["fanStatus"] === "1") {
                  const actuatorControl = new ActuatorControl({
                    deviceName: "fan1",
                    active: "on",
                  });
                  actuatorControl.simpleActuatorControl();
                  console.log("????????? 1??? ???????????? 1?????? ????????? ??????");
                } else if (detectStatus["fanStatus"] === "2") {
                  console.log("????????? ??????????????? ?????? ?????? ????????? ??????");
                } else if (detectStatus["fanStatus"] === "3") {
                  console.log("????????? 3??? ??????");
                  const actuatorControl = new ActuatorControl({
                    deviceName: "fan3",
                    active: "stop",
                  });
                  actuatorControl.simpleActuatorControl();
                }

                // detectStatus ?????? isLoop ???????????? false??? ??????
                fn.detectFsWrite("fanStatus", "2");
                fn.detectFsWrite("isLoop", false);

                const actuatorControl = new ActuatorControl({
                  deviceName: "oneTwo",
                  active: "on",
                });
                actuatorControl.simpleActuatorControl();

                const { month, day, hour, minute, second } = fn.endTime(
                  detectStatus["run"]
                );

                schedule.scheduleJob(
                  `${second} ${minute} ${hour} ${day} ${month} *`,
                  async () => {
                    console.log("?????? 2 ????????? ??????");

                    if (sensorDataList.co2Temp < settingList.settingTempMax) {
                      //????????? ?????? ?????? ??????
                      // detectStatus?????? level??? "" ?????? ??????

                      const actuatorControl = new ActuatorControl({
                        deviceName: "oneTwo",
                        active: "stop",
                      });
                      actuatorControl.simpleActuatorControl();

                      fn.detectFsWrite("fanStatus", "");

                      console.log("?????? ????????? ????????? ????????? ??????");

                      //????????? true ??????
                      const { month, day, hour, minute, second } = fn.endTime(
                        detectStatus["coolTime"]
                      );
                      console.log(
                        `??????????????? ??????????????? ??????${minute} ${second}`
                      );
                      schedule.scheduleJob(
                        `${second} ${minute} ${hour} ${day} ${month} *`,
                        async () => {
                          fn.detectFsWrite("isLoop", true);

                          console.log("????????? true ?????? ????????? ??????");
                        }
                      );
                    } else {
                      fn.detectFsWrite("isLoop", true);

                      console.log("isLoop??? true??? ??????");
                    }
                  }
                );
              } else if (sub.toFixed(1) > Number(detectStatus["fanLevel1"])) {
                //????????? ????????? ?????? ?????? ??????
                if (detectStatus["fanStatus"] === "") {
                  stage2Timer = true;
                  const actuatorControl = new ActuatorControl({
                    deviceName: "fan2",
                    active: "on",
                  });
                  actuatorControl.simpleActuatorControl();
                  console.log("????????? 2??? ???????????? 1?????? ????????? ??????");
                } else if (detectStatus["fanStatus"] === "1") {
                  console.log("????????? ??????????????? ?????? ?????? ????????? ?????????");
                } else if (detectStatus["fanStatus"] === "2") {
                  console.log("????????? 1??? ??????");
                  const actuatorControl = new ActuatorControl({
                    deviceName: "fan1",
                    active: "stop",
                  });
                  actuatorControl.simpleActuatorControl();
                } else if (detectStatus["fanStatus"] === "3") {
                  console.log("????????? 1??? ??????");
                  const actuatorControl = new ActuatorControl({
                    deviceName: "oneThree",
                    active: "stop",
                  });
                  actuatorControl.simpleActuatorControl();
                }
                // detectStatus ?????? isLoop ???????????? false??? ??????
                fn.detectFsWrite("fanStatus", "1");
                fn.detectFsWrite("isLoop", false);

                const { month, day, hour, minute, second } = fn.endTime(
                  detectStatus["run"]
                );

                schedule.scheduleJob(
                  `${second} ${minute} ${hour} ${day} ${month} *`,
                  async () => {
                    console.log("?????? 1 ????????? ??????");

                    if (sensorDataList.co2Temp < settingList.settingTempMax) {
                      //????????? ?????? ?????? ??????
                      // detectStatus?????? level??? "" ?????? ??????

                      const actuatorControl = new ActuatorControl({
                        deviceName: "fan2",
                        active: "stop",
                      });

                      actuatorControl.simpleActuatorControl();

                      fn.detectFsWrite("fanStatus", "");

                      console.log("?????? ????????? ????????? ????????? ??????");

                      //????????? true ??????
                      const { month, day, hour, minute, second } = fn.endTime(
                        detectStatus["coolTime"]
                      );
                      schedule.scheduleJob(
                        `${second} ${minute} ${hour} ${day} ${month} *`,
                        async () => {
                          fn.detectFsWrite("isLoop", true);

                          console.log("????????? true ?????? ????????? ??????");
                        }
                      );
                    } else {
                      fn.detectFsWrite("isLoop", true);

                      console.log("????????? true ?????? ????????? ??????");
                    }
                  }
                );
              }
              // ??????
            }
          }
        );
      } else {
        fn.detectFsWrite("isLoop", true);
      }

      if (stage2Timer) {
        const { month, day, hour, minute, second } = fn.endTime("50");
        shutterSchedule = schedule.scheduleJob(
          `${second} ${minute} ${hour} ${day} ${month} *`,
          async () => {
            fn.detectFsWrite("stage", "2");
            console.log("stage2??? ?????? ????????? ??????");
          }
        );
      } else {
        fn.detectFsWrite("stage", "1");

        console.log("stge1??? ??????");
      }

      if (detectStatus["stage"] === "2") {
        if (
          Number(sensorDataList["ws"]) < Number(detectStatus["ws"]) &&
          Number(sensorDataList["rf"]) < Number(detectStatus["rf"]) &&
          Number(
            sensorDataList["outTemp"] - Number(sensorDataList["co2Temp"])
          ) < 10
        ) {
          //????????? ???
          console.log(sub.toFixed(1));

          if (sub.toFixed(1) > 5) {
            console.log("????????? ??????5");
            fn.detectFsWrite("shutterStatus", "level5");
            // const actuatorControl = new ActuatorControl({
            //   deviceName: "shutters",
            //   active: "open",
            // });
            // actuatorControl.simpleActuatorControl();
            const { month, day, hour, minute, second } = fn.endTime(
              detectStatus["shutterLevel5"]
            );

            schedule.scheduleJob(
              `${second} ${minute} ${hour} ${day} ${month} *`,
              async () => {
                fn.detectFsWrite("shutterStatus", "level5");
                // const actuatorControl = new ActuatorControl({
                //   deviceName: "shutters",
                //   active: "stop",
                // });
                // actuatorControl.simpleActuatorControl();
              }
            );
          } else if (sub.toFixed(1) > 4) {
            console.log("????????? ??????4");
            fn.detectFsWrite("shutterStatus", "level4");
            // const actuatorControl = new ActuatorControl({
            //   deviceName: "shutters",
            //   active: "open",
            // });
            // actuatorControl.simpleActuatorControl();
            const { month, day, hour, minute, second } = fn.endTime(
              detectStatus["shutterLevel4"]
            );

            schedule.scheduleJob(
              `${second} ${minute} ${hour} ${day} ${month} *`,
              async () => {
                // const actuatorControl = new ActuatorControl({
                //   deviceName: "shutters",
                //   active: "stop",
                // });
                // actuatorControl.simpleActuatorControl();
              }
            );
          } else if (sub.toFixed(1) > 3) {
            console.log("????????? ??????3");
            fn.detectFsWrite("shutterStatus", "level3");
            // const actuatorControl = new ActuatorControl({
            //   deviceName: "shutters",
            //   active: "open",
            // });
            // actuatorControl.simpleActuatorControl();
            const { month, day, hour, minute, second } = fn.endTime(
              detectStatus["shutterTiming"]["level3"]
            );

            schedule.scheduleJob(
              `${second} ${minute} ${hour} ${day} ${month} *`,
              async () => {
                // const actuatorControl = new ActuatorControl({
                //   deviceName: "shutters",
                //   active: "stop",
                // });
                // actuatorControl.simpleActuatorControl();
              }
            );
          } else if (sub.toFixed(1) > 2) {
            console.log("????????? ??????2");
            fn.detectFsWrite("shutterStatus", "level2");
            // const actuatorControl = new ActuatorControl({
            //   deviceName: "shutters",
            //   active: "open",
            // });
            // actuatorControl.simpleActuatorControl();
            const { month, day, hour, minute, second } = fn.endTime(
              detectStatus["shutterLevel2"]
            );

            schedule.scheduleJob(
              `${second} ${minute} ${hour} ${day} ${month} *`,
              async () => {
                // const actuatorControl = new ActuatorControl({
                //   deviceName: "shutters",
                //   active: "stop",
                // });
                // actuatorControl.simpleActuatorControl();
              }
            );
          } else if (sub.toFixed(1) > 1) {
            console.log("????????? ??????1");
            fn.detectFsWrite("shutterStatus", "level1");
            // const actuatorControl = new ActuatorControl({
            //   deviceName: "shutters",
            //   active: "open",
            // });
            // actuatorControl.simpleActuatorControl();
            const { month, day, hour, minute, second } = fn.endTime(
              detectStatus["shutterLevel1"]
            );

            schedule.scheduleJob(
              `${second} ${minute} ${hour} ${day} ${month} *`,
              async () => {
                // const actuatorControl = new ActuatorControl({
                //   deviceName: "shutters",
                //   active: "stop",
                // });
                // actuatorControl.simpleActuatorControl();
              }
            );
          }
        }
      } else {
        // const actuatorControl = new ActuatorControl({
        //   deviceName: "shutters",
        //   active: "close",
        // });
        // actuatorControl.simpleActuatorControl();
        const { month, day, hour, minute, second } = fn.endTime(
          detectStatus["shutterLevel1"]
        );

        schedule.scheduleJob(
          `${second} ${minute} ${hour} ${day} ${month} *`,
          async () => {
            // const actuatorControl = new ActuatorControl({
            //   deviceName: "shutters",
            //   active: "stop",
            // });
            // actuatorControl.simpleActuatorControl();
            fn.detectFsWrite("shutterStatus", "close");
          }
        );
      }
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function actionLogic() error : ${
          error ?? "not load error contents"
        }`
      );
    }
  }

  async setCondition() {
    try {
      const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      const response = {
        header: {},
      };

      if (fn.invalidActionStatus(this.body)) {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        return fn.statisticsStatusCodeInvalidRequestPararmeterError(
          reqDatetime,
          resDatetime
        );
      }

      const setData = fn.selectActionStatus(this.body);

      for (let i of setData) {
        fn.actionStatusFsWrite(i.where, i.value);
      }

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      response.header = {
        resultCode: "00",
        resultMsg: "NORMAL_SERVICE",
        requestDatetime: reqDatetime,
        responseDatetime: resDatetime,
      };

      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function setCondition() error : ${
          error ?? "not load error contents"
        }`
      );
    }
  }

  async getCondition() {
    try {
      const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      const response = {
        header: {},
      };

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      const data = fn.actionStatusFsRead();
      let dataList = {};

      for (let i of Object.keys(data)) {
        if (i === "run") {
          dataList = { ...dataList, run: data[i] };
        } else if (i === "coolTime") {
          dataList = { ...dataList, coolTime: data[i] };
        } else if (i === "fanLevel1") {
          dataList = { ...dataList, fanLevel1: data[i] };
        } else if (i === "fanLevel2") {
          dataList = { ...dataList, fanLevel2: data[i] };
        } else if (i === "fanLevel3") {
          dataList = { ...dataList, fanLevel3: data[i] };
        } else if (i === "outTemp") {
          dataList = { ...dataList, outTemp: data[i] };
        } else if (i === "ws") {
          dataList = { ...dataList, ws: data[i] };
        } else if (i === "rf") {
          dataList = { ...dataList, rf: data[i] };
        } else if (i === "delay") {
          dataList = { ...dataList, delay: data[i] };
        }
      }

      response.header = {
        resultCode: "00",
        resultMsg: "NORMAL_SERVICE",
        requestDatetime: reqDatetime,
        responseDatetime: resDatetime,
      };
      response.body = dataList;

      return response;
    } catch (error) {
      console.log(error);
      logger.error(
        `src/models/SensorData.js function getCondition() error : ${
          error ?? "not load error contents"
        }`
      );
    }
  }
}

module.exports = SensorData;
