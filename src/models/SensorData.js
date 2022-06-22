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
    //    axios.post("http://220.80.174.92:9500/save-sensor-data", this.body);
    //  } catch (error) {
    //    console.log(error);
    //  }
    const insertDate = moment().format("YYYY-MM-DD HH:mm:ss");
    // console.log(this.body);
    // logger.info(JSON.stringify(this.body));
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

      if (await daFn.compareMainSensorData(filteringData)) {
        const data = fn.pickUpInsideData(filteringData, insertDate);
        console.log("변한 센서 데이터 실내");
        io.mainData.emit("insideSensorData", data);

        console.log(data);
      }
      if (await daFn.compareOutsideSensorData(filteringData)) {
        const data = fn.pickUpOutsideData(filteringData, insertDate);
        console.log("변한 센서 데이터 실외");
        io.mainData.emit("outsideSensorData", data);
        console.log(data);
      }
      return fn.normalService();
    } catch (error) {
      console.log(error);
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

      return fn.invalidRequestParameterError();
    }
  }

  async mainInsideSensorData() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const result = await DataAccess.mainInsideSensorData();

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        result[0],
        reqDatetime,
        resDatetime
      );
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async mainOutsideSensorData() {
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const result = await DataAccess.mainOutsideSensorData();

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        result[0],
        reqDatetime,
        resDatetime
      );
    } catch (error) {
      console.log(error);
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
        response.header = {
          resultCode: "10",
          resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        return response;
      }
      if (what == "hour") {
        result = await DataAccess.hourConsumptionData(startDate, endDate);
      } else if (what == "day") {
        result = await DataAccess.dailyConsumptionData(startDate, endDate);
      } else if (what == "month") {
        result = await DataAccess.monthlyConsumptionData(startDate, endDate);
      } else if (what == "year") {
        result = await DataAccess.yearlyConsumptionData(startDate, endDate);
      } else {
        const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
        const response = {
          header: {
            resultCode: "10",
            resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
            reqDatetime,
            resDatetime,
          },
        };

        return response;
      }

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      const response = fn.normalServiceIncludBody(
        result,
        reqDatetime,
        resDatetime
      );

      return response;
    } catch (error) {
      console.log(error);
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
      return fn.invalidRequestParameterError;
    }
  }

  async sensorDataHourly() {
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

      const result = await DataAccess.sensorDataHourly(startDate, endDate);

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      return fn.statisticsStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
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

      return fn.statisticsStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
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

      return fn.statisticsStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
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

      return fn.statisticsStatusCode(result, reqDatetime, resDatetime);
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError;
    }
  }
}

module.exports = SensorData;
