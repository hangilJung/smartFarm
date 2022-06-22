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

  static async hourlyConsumptionData(startDate, endDate) {
    const sql = query.hourlyConsumptionData;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async dailyConsumptionData(startDate, endDate) {
    const sql = query.dailyConsumptionData;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async monthlyConsumptionData(startDate, endDate) {
    const sql = query.monthlyConsumptionData;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async yearlyConsumptionData(startDate, endDate) {
    const sql = query.yearlyConsumptionData;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async currentAmountOfChange() {
    const sql = query.currentAmountOfChange;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMinutely(startDate, endDate) {
    const sql = query.sensorDataMinutely;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMinutely2(startDate, endDate, humiEndDate) {
    const sql = query.sensorDataMinutely2;
    const condition = [startDate, endDate, startDate, humiEndDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMinutely3(
    startDate,
    endDate,
    tempEndDate,
    humiEndDate
  ) {
    const sql = query.sensorDataMinutely3;
    const condition = [
      startDate,
      endDate,
      startDate,
      tempEndDate,
      startDate,
      humiEndDate,
    ];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataHourly(startDate, endDate) {
    const sql = query.sensorDataHourly;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataHourly2(startDate, endDate, humiEndDate) {
    const sql = query.sensorDataHourly2;
    const condition = [startDate, endDate, startDate, humiEndDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataHourly3(startDate, endDate, tempEndDate, humiEndDate) {
    const sql = query.sensorDataHourly3;
    const condition = [
      startDate,
      endDate,
      startDate,
      tempEndDate,
      startDate,
      humiEndDate,
    ];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataDaily(startDate, endDate) {
    const sql = query.sensorDataDaily;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataDaily2(startDate, endDate, humiEndDate) {
    const sql = query.sensorDataDaily2;
    const condition = [startDate, endDate, startDate, humiEndDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataDaily3(startDate, endDate, tempEndDate, humiEndDate) {
    const sql = query.sensorDataDaily3;
    const condition = [
      startDate,
      endDate,
      startDate,
      tempEndDate,
      startDate,
      humiEndDate,
    ];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMonthly(startDate, endDate) {
    const sql = query.sensorDataMonthly;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMonthly2(startDate, endDate, humiEndDate) {
    const sql = query.sensorDataMonthly2;
    const condition = [startDate, endDate, startDate, humiEndDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataMonthly3(
    startDate,
    endDate,
    tempEndDate,
    humiEndDate
  ) {
    const sql = query.sensorDataMonthly3;
    const condition = [
      startDate,
      endDate,
      startDate,
      tempEndDate,
      startDate,
      humiEndDate,
    ];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataYearly(startDate, endDate) {
    const sql = query.sensorDataYearly;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataYearly2(startDate, endDate, humiEndDate) {
    const sql = query.sensorDataYearly2;
    const condition = [startDate, endDate, startDate, humiEndDate];

    return this.#databaseAcess(sql, condition);
  }

  static async sensorDataYearly3(startDate, endDate, tempEndDate, humiEndDate) {
    const sql = query.sensorDataYearly3;
    const condition = [
      startDate,
      endDate,
      startDate,
      tempEndDate,
      startDate,
      humiEndDate,
    ];

    return this.#databaseAcess(sql, condition);
  }

  static async saveHourSensorData() {
    const sql = query.saveHourSensorData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static async saveHourRainFallData() {
    const sql = query.saveHourRainFallData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }
}

module.exports = DataAccess;
