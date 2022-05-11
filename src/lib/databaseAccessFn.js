const DataAccess = require("../models/DataAccess");

function checkDataValidation(body, getSensorDataRange, date) {
  let arr = [];

  for (let j of body["data"]) {
    if (fiteringName(j["name"])) {
      for (let i of getSensorDataRange[0]) {
        if (j.name === i.sensor_name) {
          if (
            j.value < Number(i.sensor_minimum_value) ||
            j.value > Number(i.sensor_maximum_value)
          ) {
            saveOriginalSensorData(j, date);
            arr.push({ name: j.name, value: null });
          }
          arr.push({ name: j.name, value: j.value });
        }
      }
    }
  }
  return arr;
}

function fiteringName(param) {
  const list = {
    bVol: "bVol",
    bCur: "bCur",
    bVolCurAng: "bVolCurAng",
    bFac: "bFac",
    totActPow: "totActPow",
    totReactPow: "totReactPow",
    aActCur: "aActCur",
    bActCur: "bActCur",
    aReactCur: "aReactCur",
    bReactCur: "bReactCur",
    cVol: "cVol",
    cCur: "cCur",
    cVolCurAng: "cVolCurAng",
    cFac: "cFac",
    cActCur: "cActCur",
    cReactCur: "cReactCur",
  };

  if (list[param] === undefined) {
    return true;
  } else {
    return false;
  }
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
