const DataAccess = require("../models/DataAccess");
const fn = require("./fn");
const logger = require("../config/logger");
const fs = require("fs");
const { io } = require("socket.io-client");

const nutrient = io(process.env.SOCKETIO_NUTRICULTURE_MACHINE_PAGE, {
  transports: ["websocket"],
});

nutrient.on("connect", () => {
  console.log(nutrient.id);
  console.log(nutrient.connected);
});

nutrient.on("connect_error", (reason) => {
  console.log(reason);
});

nutrient.on("disconnect", (reason) => {
  console.log(reason);
  console.log("disconnect");
});

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
            break;
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
    outPress: "outPress",
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
  logger.error(`sensor data error ${JSON.stringify(data)}`);
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

async function compareMainSensorData(filteringData, agoSensorData) {
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

async function compareOutsideSensorData(filteringData, agoSensorData) {
  let compare = false;

  if (agoSensorData[0].length > 0) {
    for (let i of filteringData) {
      if (compare) break;
      if (outsideSensorName(i)) {
        for (let j of agoSensorData[0]) {
          if (loadDbOutsideSensorName(j)) {
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

function outsideSensorName(i) {
  if (
    i["name"] === "outTemp" ||
    i["name"] === "outHumi" ||
    i["name"] === "outInsol" ||
    i["name"] === "ws" ||
    i["name"] === "rf"
  ) {
    return true;
  } else {
    return false;
  }
}

function loadDbOutsideSensorName(j) {
  if (
    j["sensor_name"] === "outTemp" ||
    j["sensor_name"] === "outHumi" ||
    j["sensor_name"] === "outInsol" ||
    j["sensor_name"] === "ws" ||
    j["sensor_name"] === "rf"
  ) {
    return true;
  } else {
    return false;
  }
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

async function compareNutricultureMachinePageStatusValue(nutrientData, dbData) {
  let result = false;
  let list = [];

  try {
    for (let i of nutrientData) {
      for (let j of dbData) {
        if (i["address"] == j["address"]) {
          if (i["value"] != j["value"]) {
            console.log("양액기 데이터 다름");
            list.push(i);
            result = true;
          }
        }
      }
    }

    console.log(list);

    await DataAccess.updateNutricultureMachinePageStatus(list);

    const dbResult = await DataAccess.todaySupply();
    const compare = compareFsRead();

    let status = false;

    for (let i of dbResult[0]) {
      if (i["value"] === compare[i["address"]]) {
        console.log("양액기 정지 상태");
      } else {
        console.log("양액기 운전 상태");
        status = true;
        break;
      }
    }

    if (status) {
      const current = await DataAccess.currentAmountOfChange();

      if (
        current[0][0]["sensor_data_value"] > fn.addCurrent(fn.deviceStatus())
      ) {
        console.log("양액기 전류값 확인 후 작동 상태 확인");

        fn.currentValueFsWrite("nutrient", "on");

        nutrient.emit("nutrientStatus", {
          header: {
            resultCode: "00",
            resultMsg: "NORMAL_SERVICE",
          },
          body: [
            {
              status: "on",
            },
          ],
        });
      } else {
        fn.currentValueFsWrite("nutrient", "off");
      }

      for (let i of dbResult[0]) {
        compareFsWrite(i["address"], i["value"]);
      }
    } else {
      console.log("보내라 소켓통신");
      fn.currentValueFsWrite("nutrient", "off");
      nutrient.emit("nutrientStatus", {
        header: {
          resultCode: "00",
          resultMsg: "NORMAL_SERVICE",
        },
        body: [
          {
            status: "off",
          },
        ],
      });
    }

    return { result, list };
  } catch (error) {
    console.log(error);
    return fn.invalidRequestParameterError();
  }
}

function compareFsRead() {
  return JSON.parse(
    fs.readFileSync(__dirname + "/../utils/compareTodaySupply.json", "utf8")
  );
}

function compareFsWrite(where, value) {
  const fileRead = compareFsRead();
  fileRead[where] = value;
  fs.writeFileSync(
    __dirname + "/../utils/compareTodaySupply.json",
    JSON.stringify(fileRead)
  );
}

function dbUpdate(changeData) {
  const transChangeData = changeData.map((data) => {
    return { address: data["modbus_address"], value: data["description"] };
  });

  DataAccess.updateNutricultureMachinePageStatus(transChangeData);
}

module.exports = {
  checkDataValidation,
  compareSensorData,
  compareMainSensorData,
  compareNutricultureMachinePageStatusValue,
  dbUpdate,
  compareOutsideSensorData,
};
