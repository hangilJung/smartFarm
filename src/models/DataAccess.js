const pool = require("../config/db");
const { multipleConditions } = require("../lib/fn");
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

      return cnt;
    } catch (error) {
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

  static mainSensorData() {
    const sql = query.mainSensorData;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static loadMinutesSensorData(startDate, endDate) {
    const sql = query.loadMinutesSensorData;
    const condition = [startDate, endDate];

    return this.#databaseAcess(sql, condition);
  }

  static loadHoursSensorData(startDate, endDate) {
    const sql = query.loadHoursSensorData;
    const condition = [startDate, endDate];

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

  /* ===============start test================ */
  static loadSensorDataAll() {
    const sql = query.loadSensorDataAll;
    const condition = [];

    return this.#databaseAcess(sql, condition);
  }

  static loadSensorDataValueRange() {
    const sql = "";

    return this.#databaseAcess(sql, condition);
  }

  /* ===============end test================ */
}

module.exports = DataAccess;
