const DataAccess = require("./DataAccess");
const moment = require("moment");
const fn = require("../lib/fn");
const daFn = require("../lib/databaseAccessFn");
const io = require("../utils/io");

class SensorData {
  constructor(body) {
    this.body = body;
  }

  async #trycatch(a) {
    try {
      const result = await a;

      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        result
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
        const mainData = fn.pickUpData(filteringData, insertDate);

        io.mainData.emit("changeMainSensorData", mainData);
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
    try {
      const result = await DataAccess.mainInsideSensorData();

      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        result
      );
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async mainOutsideSensorData() {
    try {
      const result = await DataAccess.mainOutsideSensorData();

      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        result
      );
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async readBedData() {
    try {
      const result = await DataAccess.readBedData();

      return fn.responseHeaderNormalServiceOrNotDataError(
        fn.dataExistsOrNot(result),
        result
      );
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

    return this.#trycatch(DataAccess.loadMinutesSensorData(startDate, endDate));
  }

  async loadHoursSensorData() {
    const { what } = this.body;
    const settingDate = moment()
      .subtract(5, "hours")
      .format("YYYY-MM-DD HH:mm:ss");
    const { id1, id2 } = fn.hoursSensorDataFilter(what);

    if (what === "co2") {
      return this.#trycatch(
        DataAccess.loadHoursCo2SensorData(settingDate, id1)
      );
    } else {
      return this.#trycatch(
        DataAccess.loadHoursSensorData(settingDate, id1, id2)
      );
    }
  }

  async loadDaysSensorData() {
    const { startDate, endDate } = this.#getDate();

    return this.#trycatch(DataAccess.loadDaysSensorData(startDate, endDate));
  }

  async loadMonthsSensorData() {
    const { startDate, endDate } = this.#getDate();

    return this.#trycatch(DataAccess.loadMonthsSensorData(startDate, endDate));
  }

  async loadYearsSensorData() {
    const { startDate, endDate } = this.#getDate();

    return this.#trycatch(DataAccess.loadYearsSensorData(startDate, endDate));
  }
}

module.exports = SensorData;
