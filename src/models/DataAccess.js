const pool = require("../config/db");
const { multipleConditions, nutrientMultipleConditions } = require("../lib/fn");
const query = require("./query");

class DataAccess {
  static async #databaseAcess(sql, condition) {
    try {
      const result = await pool.query(sql, condition);

      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static loadLatelySensorData(conditionalDate) {
    const sql = query.loadSensorData;
    const condition = [conditionalDate];

    return this.#databaseAcess(sql, condition);
  }

  static async saveSensorData(convertData, insertDate) {
    const sql = query.saveData;
    let result;
    let ctn = 0;

    try {
      for (let i = 0; i < convertData.length; i++) {
        pool.query(sql, multipleConditions(i, convertData, insertDate));

        // if (result[0].affectedRows > 0) {
        //   ctn += 1;
        // }
      }

      return "success";
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static login(user_id, user_pw) {
    const sql = query.login;
    const condition = [user_id, user_pw];

    return this.#databaseAcess(sql, condition);
  }

  static getSensorDataRange() {
    const sql = query.getSensorDataRange;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static saveInvalidSensorData(data, date) {
    const sql = query.saveInvalidSensorData;
    const condition = [data["name"], data["value"], date];

    return this.#databaseAcess(sql, condition);
  }

  static loadActionRecord() {
    const sql = query.loadActionRecord;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static loadAFewMinutesAgoSensorData() {
    const sql = query.aFewMinutesAgo;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static actuatorControlActionRecord(deviceName, content) {
    const sql = query.actionRecord;
    const condition = [deviceName, content];

    return this.#databaseAcess(sql, condition);
  }

  static saveDate(date, id) {
    const sql = query.maxCreatedAt;
    const condition = [id, date, id];

    return this.#databaseAcess(sql, condition);
  }

  static actuatorStatusZero() {
    const sql = query.actuatorStatusZero;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static mainInsideSensorData() {
    const sql = query.mainInsideSensorData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static mainOutsideSensorData() {
    const sql = query.mainOutsideSensorData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static loadMinutesSensorData(startDate, endDate) {
    const sql = query.loadMinutesSensorData;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static loadHoursSensorData(settingDate, id1, id2) {
    const sql = query.loadHoursSensorData;
    const condition = [settingDate, id1, id2];

    return this.#databaseAcess(sql, condition);
  }

  static loadHoursCo2SensorData(settingDate, id1) {
    const sql = query.loadHoursCo2SensorData;
    const condition = [settingDate, id1];

    return this.#databaseAcess(sql, condition);
  }

  static loadDaysSensorData(startDate, endDate) {
    const sql = query.loadDaysSensorData;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static loadMonthsSensorData(startDate, endDate) {
    const sql = query.loadMonthsSensorData;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static loadYearsSensorData(startDate, endDate) {
    const sql = query.loadYearSensorData;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static updateSensorSettingValue(settingValue, sensorName) {
    const sql = query.updateSensorDataSettingValue;
    const condition = [settingValue, sensorName];

    return this.#databaseAcess(sql, condition);
  }

  static nutrientStartSupplyDatetime(matter, line, startSupplyDatetime) {
    const sql = query.nutrientStartSupplyDatetime;
    const condition = [matter, line, startSupplyDatetime];

    return this.#databaseAcess(sql, condition);
  }

  static nutrientLineSupply() {
    const sql = query.nutrientLineSupply;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static nutrientEndSupplyDatetime(supply, todaySupply, endSupplyDatetime) {
    const sql = query.nutrientStartSupplyDatetime;
    const condition = [supply, todaySupply, endSupplyDatetime];

    return this.#databaseAcess(sql, condition);
  }

  static readNutrientSupply() {
    const sql = query.readNutrientSupply;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async hourlyLineSupply(data) {
    const sql = query.hourlyLineSupply;

    try {
      for (let i = 0; i < data.length; i++) {
        pool.query(sql, arrayCondition(i, data));

        // if (result[0].affectedRows > 0) {
        //   ctn += 1;
        // }
      }

      return cnt;
    } catch (error) {
      return error;
    }
  }

  static async readBedData() {
    const sql = query.readBedData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async updateNutricultureMachinePageStatus(data) {
    const sql = query.updateNutricultureMachinePageStatus;
    try {
      for (let i = 0; i < data.length; i++) {
        const result = await pool.query(
          sql,
          nutrientMultipleConditions(i, data)
        );
        console.log(result);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async nutricultureMachinePageStatusValue() {
    const sql = query.nutricultureMachinePageStatusValue;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async writeHourConsumptionData() {
    const sql = query.writeHourConsumptionData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async test(data) {
    const sql = query.insertNutricultureMachinePageStatusValue;

    try {
      for (let i = 0; i < data.length; i++) {
        const result = await pool.query(sql, [
          data[i]["address"],
          data[i]["value"],
        ]);
        console.log(result);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async hourConsumptionData() {
    const sql = query.hourConsumptionData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async dayConsumptionData() {
    const sql = query.dayConsumptionData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async monthConsumptionData() {
    const sql = query.monthConsumptionData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async yearConsumptionData() {
    const sql = query.yearConsumptionData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async accumulateConsumptionData() {
    const sql = query.accumulateConsumptionData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async currentAmountOfChange() {
    const sql = query.currentAmountOfChange;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMinutelyInside(startDate, endDate) {
    const sql = query.sensorDataMinutelyInside;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMinutelyOutside(startDate, endDate) {
    const sql = query.sensorDataMinutelyOutside;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMinutelyBed(
    startDate,
    endDate,
    soilEc,
    soilTemperature,
    soilHumidity,
    soilPh
  ) {
    const sql = query.sensorDataMinutelyBed;
    const condition = [
      startDate,
      endDate,
      soilEc,
      soilTemperature,
      soilHumidity,
      soilPh,
    ];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataHourlyInside(startDate, endDate) {
    const sql = query.sensorDataHourlyInside;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataHourlyOutside(startDate, endDate) {
    const sql = query.sensorDataHourlyOutside;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataHourlyBed(
    startDate,
    endDate,
    soilEc,
    soilTemperature,
    soilHumidity,
    soilPh
  ) {
    const sql = query.sensorDataHourlyBed;
    const condition = [
      startDate,
      endDate,
      soilEc,
      soilTemperature,
      soilHumidity,
      soilPh,
    ];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataDailyInside(startDate, endDate) {
    const sql = query.sensorDataDailyInside;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataDailyOutside(startDate, endDate) {
    const sql = query.sensorDataDailyOutside;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataDailyBed(
    startDate,
    endDate,
    soilEc,
    soilTemperature,
    soilHumidity,
    soilPh
  ) {
    const sql = query.sensorDataDailyBed;
    const condition = [
      startDate,
      endDate,
      soilEc,
      soilTemperature,
      soilHumidity,
      soilPh,
    ];
    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMonthlyInside(startDate, endDate) {
    const sql = query.sensorDataMonthlyInside;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMonthlyOutside(startDate, endDate) {
    const sql = query.sensorDataMonthlyOutside;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMonthlyBed(
    startDate,
    endDate,
    soilEc,
    soilTemperature,
    soilHumidity,
    soilPh
  ) {
    const sql = query.sensorDataMonthlyBed;
    const condition = [
      startDate,
      endDate,
      soilEc,
      soilTemperature,
      soilHumidity,
      soilPh,
    ];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataYearlyInside(startDate, endDate) {
    const sql = query.sensorDataYearlyInside;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataYearlyOutside(startDate, endDate) {
    const sql = query.sensorDataYearlyOutside;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataYearlyBed(
    startDate,
    endDate,
    soilEc,
    soilTemperature,
    soilHumidity,
    soilPh
  ) {
    const sql = query.sensorDataYearlyBed;
    const condition = [
      startDate,
      endDate,
      soilEc,
      soilTemperature,
      soilHumidity,
      soilPh,
    ];

    return this.#databaseAcess(sql, condition);
  }
}

module.exports = DataAccess;
