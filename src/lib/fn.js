const headerErrorCode = require("../utils/headerErrorCode");

function dataExtraction(data) {
  return convertJsonInArrayToJson(convertBufferDataToJsonFormat(data));
}

function convertBufferDataToJsonFormat(data) {
  return JSON.parse(data)["data"];
}

function convertJsonInArrayToJson(columns) {
  let keyAndValueData = {};
  for (let colum of columns) {
    keyAndValueData[colum.name] = colum.value;
  }
  return keyAndValueData;
}

function multipleConditions(i, convertData, insertDate) {
  let condition = [convertData[i]["name"], convertData[i]["value"], insertDate];
  return condition;
}

function emergencyStop() {}

module.exports = {
  convertBufferDataToJsonFormat,
  multipleConditions,
  dataExtraction,
  convertJsonInArrayToJson,
};
