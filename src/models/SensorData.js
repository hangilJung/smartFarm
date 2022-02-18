const DataAccess = require("./DataAccess");
const moment = require("moment");
const {
  convertBufferDataToJsonFormat,
  multipleConditions,
  dataExtraction,
  convertJsonInArrayToJson,
} = require("../lib/fn");
const headerErrorCode = require("../utils/headerErrorCode");

class SensorData {
  constructor(body) {
    this.body = body;
  }

  async saveSensorData() {
    let response = {
      header: {},
    };
    const insertDate = moment().format("YYYY-MM-DD HH:mm:ss");

    // const convertData = convertBufferDataToJsonFormat(this.body);
    // const convertData = convertJsonInArrayToJson(this.body["data"]);

    try {
      const result = await DataAccess.saveSensorData(
        this.body["data"],
        insertDate
      );
      if (result === this.body["data"].length) {
        response.header = headerErrorCode.normalService;
      } else {
        response.header = headerErrorCode.invalidRequestParameterError;
      }

      return response;
    } catch (error) {
      console.log(error);
      response.header = headerErrorCode.invalidRequestParameterError;

      return response;
    }
  }

  async loadSensorData() {
    let response = {
      header: {},
    };
    const conditionalDate = moment().format("YYYY-MM-DD HH:mm:00");

    try {
      const result = await DataAccess.loadSensorData(conditionalDate);
      console.log(result[0]);
      response.header = headerErrorCode.normalService;
      response.body = result[0];

      return response;
    } catch (error) {
      console.log(error);

      response.header = headerErrorCode.invalidRequestParameterError;
      return response;
    }
  }
}

module.exports = SensorData;
