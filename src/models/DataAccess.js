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

  static loadSensorData(conditionalDate) {
    let sql = query.loadSensorData;
    let condition = [conditionalDate];
    return this.#databaseAcess(sql, condition);
  }

  static async saveSensorData(convertData, insertDate) {
    let sql = query.saveData;
    let result;
    let ctn = 0;

    try {
      for (let i = 0; i < convertData.length; i++) {
        result = await pool.query(
          sql,
          multipleConditions(i, convertData, insertDate)
        );
        if (result[0].affectedRows > 0) {
          console.log(result);
          ctn += 1;
        }
      }
      console.log(ctn);
      return ctn;
    } catch (error) {
      console.log(error);
      return "fail";
    }
  }

  static async loadMinuteAgoSensorData() {}

  static async runActuatorMachine() {}

  static async stopActuatorMachine() {}

  static login(user_id, user_pw) {
    let sql = query.login;
    let condition = [user_id, user_pw];

    return this.#databaseAcess(sql, condition);
  }
}

module.exports = DataAccess;
