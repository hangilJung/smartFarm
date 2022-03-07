const DataAccess = require("../models/DataAccess");

function checkDataValidation(body, getSensorDataRange, date) {
  return body["data"].map((data) => {
    for (let i of getSensorDataRange[0]) {
      if (data.name === i.sensor_name) {
        if (
          data.value < i.sensor_minimum_value ||
          data.value > i.sensor_maximum_value
        ) {
          saveOriginalSensorData(data, date);
          return (data = { name: data.name, value: null });
        }
        return (data = data);
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

module.exports = {
  checkDataValidation,
};
