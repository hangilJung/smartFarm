const DataAccess = require("./DataAccess");
const moment = require("moment");
const fn = require("../lib/fn");
const daFn = require("../lib/databaseAccessFn");
const io = require("../utils/io");
const logger = require("../config/logger");
const axios = require("axios");

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
    //  try {
    //  axios.post(process.env.TEST_LOCAL_SERVER, this.body);
    //  } catch (error) {
    //    console.log(error);
    //  }
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
        console.log("변한 센서 데이터 실내");
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
        console.log("변한 센서 데이터 실외");
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
      const result = await DataAccess.fiveMinuteAgoSensorData();

      let sensorData = fn.readActionStatus();

      for (let i of result[0]) {
        const value = Number(i["sensor_data_value"]);
        if (i.sensor_name === "co2Humi") {
          sensorData = { ...sensorData, fiveMinuteAgoInHumi: value.toFixed(1) };
        } else if (i.sensor_name === "co2Temp") {
          sensorData = { ...sensorData, fiveMinuteAgoInTemp: value.toFixed(1) };
        } else if (i.sensor_name === "inInsol") {
          sensorData = {
            ...sensorData,
            fiveMinuteAgoInInsol: value.toFixed(1),
          };
        }
      }

      response.header = {
        resultCode: "00",
        resultMsg: "NORMAL_SERVICE",
        requestDatetime: reqDatetime,
        responseDatetime: resDatetime,
      };
      response.body = [sensorData];

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
}

module.exports = SensorData;
