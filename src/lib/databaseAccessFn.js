const DataAccess = require("../models/DataAccess");

function checkDataValidation(body, getSensorDataRange, date) {
  return body["data"].map((data) => {
    for (let i of getSensorDataRange[0]) {
      if (data.name === i.sensor_name) {
        if (
          data.value < Number(i.sensor_minimum_value) ||
          data.value > Number(i.sensor_maximum_value)
        ) {
          saveOriginalSensorData(data, date);
          return (data = { name: data.name, value: null });
        }
        return (data = { name: data.name, value: data.value });
      }
    }
  });
}

function saveOriginalSensorData(data, date) {
  DataAccess.saveInvalidSensorData(
    { name: data.name, value: data.value },
    date
  );
}

async function compareSensorData(filteringData) {
  const agoSensorData = await DataAccess.loadAFewMinutesAgoSensorData();
  let compare = false;

  if (agoSensorData[0].length > 0) {
    for (let i of filteringData) {
      if (compare) break;

      for (let j of agoSensorData[0]) {
        if (i["name"] === j["sensor_name"]) {
          if (Number(i["value"]) != Number(j["sensor_data_value"])) {
            compare = true;
            break;
          }
        }
      }
    }
  }
  return compare;
}

async function compareMainSensorData(filteringData) {
  const agoSensorData = await DataAccess.loadAFewMinutesAgoSensorData();
  let compare = false;

  if (agoSensorData[0].length > 0) {
    for (let i of filteringData) {
      if (compare) break;
      if (mainSensorName(i)) {
        for (let j of agoSensorData[0]) {
          if (loadDbSensorName(j)) {
            if (compareDataValue(i, j)) {
              compare = true;
              break;
            }
          }
        }
      }
    }
  }
  return compare;
}

function mainSensorName(i) {
  if (
    i["name"] === "inTemp" ||
    i["name"] === "inHumi" ||
    i["name"] === "inInsol" ||
    i["name"] === "co2"
  ) {
    return true;
  } else {
    return false;
  }
}

function loadDbSensorName(j) {
  if (
    j["sensor_name"] === "inTemp" ||
    j["sensor_name"] === "inHumi" ||
    j["sensor_name"] === "inInsol" ||
    j["sensor_name"] === "co2"
  ) {
    return true;
  } else {
    return false;
  }
}

function compareDataValue(i, j) {
  return Number(i["value"]) != Number(j["sensor_data_value"]);
}

module.exports = {
  checkDataValidation,
  compareSensorData,
  compareMainSensorData,
};
