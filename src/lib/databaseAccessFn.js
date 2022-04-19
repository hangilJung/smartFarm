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

module.exports = {
  checkDataValidation,
  compareSensorData,
};
