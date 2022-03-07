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
        result = await pool.query(
          sql,
          multipleConditions(i, convertData, insertDate)
        );
        if (result[0].affectedRows > 0) {
          ctn += 1;
        }
      }

      return ctn;
    } catch (error) {
      console.log(error);

      return "fail";
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

  //이름으로 무엇을 하는지 알 수 없음
  static async dataValidation() {
    this.#databaseAcess(sql, condition);
  }

  static async loadMinuteAgoSensorData() {}

  static async runActuatorMachine() {}

  static async stopActuatorMachine() {}

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
