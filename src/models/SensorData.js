const DataAccess = require("./DataAccess");
const moment = require("moment");
const fn = require("../lib/fn");
const daFn = require("../lib/databaseAccessFn");
const io = require("../utils/io");
const logger = require("../config/logger");

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
        result,
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
    // logger.info(JSON.stringify(this.body));

    const insertDate = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const getSensorDataRange = await DataAccess.getSensorDataRange();
      const filteringData = await daFn.checkDataValidation(
        this.body,
        getSensorDataRange,
        insertDate
      );
      const id = fn.findSensorInformationId(filteringData);

      await DataAccess.saveDate(insertDate, id);

      const result = await DataAccess.saveSensorData(filteringData, insertDate);

      if (await daFn.compareMainSensorData(filteringData)) {
        const data = fn.pickUpInsideData(filteringData, insertDate);
        console.log("변한 센서 데이터들을 보냄");
        io.mainData.emit("insideSensorData", data);

        console.log(data);
      }
      if (await daFn.compareOutsideSensorData(filteringData)) {
        const data = fn.pickUpOutsideData(filteringData, insertDate);
        io.mainData.emit("outsideSensorData", data);
      }
      return fn.normalService();
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async loadLatelySensorData() {
    // const conditionalDate = moment().format("YYYY-MM-DD HH:mm:00");

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

  async loadSensorDataAll() {
    try {
      const result = await DataAccess.loadSensorDataAll();

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

      if (result[0] > 0) {
      }

      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        result,
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
        result,
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

  async reactFirstMainData() {
    try {
      const result = await this.mainSensorData();

      return result.body;
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
    } else {
      return this.#trycatch(
        DataAccess.loadHoursSensorData(settingDate, id1, id2),
        reqDatetime
      );
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

  async sensorDataMinutely() {
    const { what, startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const response = {
      header: {},
    };

    let result;
    try {
      if (fn.dateChecker(startDate, endDate)) {
        response.header = {
          resultCode: "10",
          resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        return response;
      }

      if (what == "inside") {
        result = await DataAccess.sensorDataMinutelyInside(startDate, endDate);
      } else if (what == "outside") {
        result = await DataAccess.sensorDataMinutelyOutside(startDate, endDate);
      } else if (what == "bed1") {
        result = await DataAccess.sensorDataMinutelyBed(
          startDate,
          endDate,
          "14",
          "15",
          "16",
          "17"
        );
      } else if (what == "bed2") {
        result = await DataAccess.sensorDataMinutelyBed(
          startDate,
          endDate,
          "22",
          "23",
          "24",
          "25"
        );
      } else if (what == "bed3") {
        result = await DataAccess.sensorDataHourlyBed(
          startDate,
          endDate,
          "18",
          "19",
          "20",
          "21"
        );
      } else if (what == "bed4") {
        result = await DataAccess.sensorDataHourlyBed(
          startDate,
          endDate,
          "26",
          "27",
          "28",
          "29"
        );
      }

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      if (fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "00",
          resultMsg: "NORMAL_SERVICE",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        response.body = result[0];
      } else if (!fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "02",
          resultMsg: "NO_DATA_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
      }

      return response;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError;
    }
  }

  async sensorDataHourly() {
    const { what, startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const response = {
      header: {},
    };

    let result;
    try {
      if (fn.dateChecker(startDate, endDate)) {
        response.header = {
          resultCode: "10",
          resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        return response;
      }

      if (what == "inside") {
        result = await DataAccess.sensorDataHourlyInside(startDate, endDate);
      } else if (what == "outside") {
        result = await DataAccess.sensorDataHourlyOutside(startDate, endDate);
      } else if (what == "bed1") {
        result = await DataAccess.sensorDataHourlyBed(
          startDate,
          endDate,
          "14",
          "15",
          "16",
          "17"
        );
      } else if (what == "bed2") {
        result = await DataAccess.sensorDataHourlyBed(
          startDate,
          endDate,
          "22",
          "23",
          "24",
          "25"
        );
      } else if (what == "bed3") {
        result = await DataAccess.sensorDataHourlyBed(
          startDate,
          endDate,
          "18",
          "19",
          "20",
          "21"
        );
      } else if (what == "bed4") {
        result = await DataAccess.sensorDataHourlyBed(
          startDate,
          endDate,
          "26",
          "27",
          "28",
          "29"
        );
      }

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      if (fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "00",
          resultMsg: "NORMAL_SERVICE",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        response.body = result[0];
      } else if (!fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "02",
          resultMsg: "NO_DATA_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
      }

      return response;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError;
    }
  }

  async sensorDataDaily() {
    const { what, startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const response = {
      header: {},
    };

    let result;
    try {
      if (fn.dateChecker(startDate, endDate)) {
        response.header = {
          resultCode: "10",
          resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        return response;
      }
      if (what == "inside") {
        result = await DataAccess.sensorDataDailyInside(startDate, endDate);
      } else if (what == "outside") {
        result = await DataAccess.sensorDataDailyOutside(startDate, endDate);
      } else if (what == "bed1") {
        result = await DataAccess.sensorDataDailyBed(
          startDate,
          endDate,
          "14",
          "15",
          "16",
          "17"
        );
      } else if (what == "bed2") {
        result = await DataAccess.sensorDataDailyBed(
          startDate,
          endDate,
          "22",
          "23",
          "24",
          "25"
        );
      } else if (what == "bed3") {
        result = await DataAccess.sensorDataDailyBed(
          startDate,
          endDate,
          "18",
          "19",
          "20",
          "21"
        );
      } else if (what == "bed4") {
        result = await DataAccess.sensorDataDailyBed(
          startDate,
          endDate,
          "26",
          "27",
          "28",
          "29"
        );
      }

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      if (fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "00",
          resultMsg: "NORMAL_SERVICE",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        response.body = result[0];
      } else if (!fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "02",
          resultMsg: "NO_DATA_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
      }

      return response;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError;
    }
  }

  async sensorDataMonthly() {
    const { what, startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const response = {
      header: {},
    };

    let result;
    try {
      if (fn.dateChecker(startDate, endDate)) {
        response.header = {
          resultCode: "10",
          resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        return response;
      }

      if (what == "inside") {
        result = await DataAccess.sensorDataMonthlyInside(startDate, endDate);
      } else if (what == "outside") {
        result = await DataAccess.sensorDataMonthlyOutside(startDate, endDate);
      } else if (what == "bed1") {
        result = await DataAccess.sensorDataMonthlyBed(
          startDate,
          endDate,
          "14",
          "15",
          "16",
          "17"
        );
      } else if (what == "bed2") {
        result = await DataAccess.sensorDataMonthlyBed(
          startDate,
          endDate,
          "22",
          "23",
          "24",
          "25"
        );
      } else if (what == "bed3") {
        result = await DataAccess.sensorDataMonthlyBed(
          startDate,
          endDate,
          "18",
          "19",
          "20",
          "21"
        );
      } else if (what == "bed4") {
        result = await DataAccess.sensorDataMonthlyBed(
          startDate,
          endDate,
          "26",
          "27",
          "28",
          "29"
        );
      }

      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      if (fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "00",
          resultMsg: "NORMAL_SERVICE",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        response.body = result[0];
      } else if (!fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "02",
          resultMsg: "NO_DATA_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
      }

      return response;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError;
    }
  }

  async sensorDataYearly() {
    const { what, startDate } = this.body;
    let { endDate } = this.body;
    endDate = fn.addEndDate(endDate);
    const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const response = {
      header: {},
    };

    let result;
    try {
      if (fn.dateChecker(startDate, endDate)) {
        response.header = {
          resultCode: "10",
          resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        return response;
      }

      if (what == "inside") {
        result = await DataAccess.sensorDataYearlyInside(startDate, endDate);
      } else if (what == "outside") {
        result = await DataAccess.sensorDataYearlyOutside(startDate, endDate);
      } else if (what == "bed1") {
        result = await DataAccess.sensorDataYearlyOutside(
          startDate,
          endDate,
          "14",
          "15",
          "16",
          "17"
        );
      } else if (what == "bed2") {
        result = await DataAccess.sensorDataYearlyOutside(
          startDate,
          endDate,
          "22",
          "23",
          "24",
          "25"
        );
      } else if (what == "bed3") {
        result = await DataAccess.sensorDataYearlyOutside(
          startDate,
          endDate,
          "18",
          "19",
          "20",
          "21"
        );
      } else if (what == "bed4") {
        result = await DataAccess.sensorDataYearlyOutside(
          startDate,
          endDate,
          "26",
          "27",
          "28",
          "29"
        );
      }
      const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

      if (fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "00",
          resultMsg: "NORMAL_SERVICE",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
        response.body = result[0];
      } else if (!fn.dataExistsOrNot(result)) {
        response.header = {
          resultCode: "02",
          resultMsg: "NO_DATA_ERROR",
          requestDatetime: reqDatetime,
          responseDatetime: resDatetime,
        };
      }

      return response;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError;
    }
  }
}

module.exports = SensorData;
