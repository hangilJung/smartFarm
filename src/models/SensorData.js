const DataAccess = require("./DataAccess");
const moment = require("moment");
const {
  dataExistsOrNot,
  responseHeaderNormalServiceOrNotDataError,
  sensorDataRealtimeCommunication,
} = require("../lib/fn");
const { checkDataValidation } = require("../lib/databaseAccessFn");
const headerStatusCode = require("../utils/headerStatusCode.js");

class SensorData {
  constructor(body) {
    this.body = body;
  }

  async saveSensorData() {
    let response = {
      header: {},
    };
    const insertDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const getSensorDataRange = await DataAccess.getSensorDataRange();
    const filteringData = await checkDataValidation(
      this.body,
      getSensorDataRange,
      insertDate
    );

    try {
      const result = await DataAccess.saveSensorData(
        filteringData,
        insertDate,
        insertDate
      );
      if (result === this.body["data"].length) {
        response.header = headerStatusCode.normalService;
        sensorDataRealtimeCommunication();
      } else {
        response.header = headerStatusCode.invalidRequestParameterError;
      }

      return response;
    } catch (error) {
      console.log(error);
      response.header = headerStatusCode.invalidRequestParameterError;

      return response;
    }
  }

  async loadLatelySensorData() {
    // const conditionalDate = moment().format("YYYY-MM-DD HH:mm:00");

    try {
      const result = await DataAccess.loadLatelySensorData();

      return responseHeaderNormalServiceOrNotDataError(
        dataExistsOrNot(result),
        result
      );
    } catch (error) {
      console.log(error);

      response.header = headerStatusCode.invalidRequestParameterError;
      return response;
    }
  }

  async loadSensorDataAll() {
    try {
      const result = await DataAccess.loadSensorDataAll();

      return responseHeaderNormalServiceOrNotDataError(
        dataExistsOrNot(result),
        result
      );
    } catch (error) {
      console.log(error);
      response.header = headerStatusCode.invalidRequestParameterError;

      return response;
    }
  }
}

module.exports = SensorData;
