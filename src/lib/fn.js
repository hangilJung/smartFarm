const headerStatusCode = require("../utils/headerStatusCode.js");
const fs = require("fs");
const Token = require("../models/Token");
const actu = require("../utils/actuator");
const moment = require("moment");

function dataExtraction(data) {
  return convertJsonInArrayToJson(convertBufferDataToJsonFormat(data));
}

function convertBufferDataToJsonFormat(data) {
  return data["data"];
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

function dataExistsOrNot(result) {
  return result[0].length > 0;
}

function responseHeaderNormalServiceOrNotDataError(
  trueAndFalse,
  data,
  reqDatetime,
  resDatetime
) {
  if (trueAndFalse) {
    const response = {
      header: {
        resultCode: "00",
        resultMsg: "NORMAL_SERVICE",
        requestDatetime: reqDatetime,
        responseDatetime: resDatetime,
      },
      body: data,
    };

    return response;
  } else if (!trueAndFalse) {
    const response = {
      header: {
        resultCode: "02",
        resultMsg: "NO_DATA_ERROR",
        reqDatetime,
        resDatetime,
      },
      body: [{ device: "sensor" }],
    };

    return response;
  } else {
    const response = {
      header: {
        resultCode: "10",
        resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
        reqDatetime,
        resDatetime,
      },
      body: [{ device: "sensor" }],
    };

    return response;
  }
}

const requestWithToken = async (url, body) => {
  try {
    let dataBuffer = fs.readFileSync(
      __dirname + "/../accessToken.json",
      "utf8"
    );
    let data = JSON.parse(dataBuffer);
    const result = await axios.post(url, body, {
      headers: {
        authorization: data.accessToken,
      },
    });

    return result;
  } catch (error) {
    try {
      const getAccessToken = await axios.post(ipAddress + "/token/v1", null, {
        headers: {
          authorization: refresh,
        },
      });
      let dataBuffer = fs.readFileSync(
        __dirname + "/../accessToken.json",
        "utf8"
      );
      let token = await JSON.parse(dataBuffer);
      token.accessToken = await getAccessToken.data.body.accessToken;
      dataJSON = JSON.stringify(token);
      fs.writeFileSync(__dirname + "/../accessToken.json", dataJSON);
      console.log(__dirname);
      const access = await axios.post(url, body, {
        headers: {
          authorization: getAccessToken.data.body.accessToken,
        },
      });

      return access.data.body;
    } catch (error) {
      console.log(error);
    }
  }
};

function reissuanceToken() {
  const tokenIssue = new Token(process.env.ACCESS_SERVER_SECRET_KEY);
  const result = tokenIssue.tokenIssue();
  tokenFsWrite(result.body.token);
}

function tokenFsWrite(issuedToken) {
  const token = tokenFsRead();
  token["accessToken"] = issuedToken;
  fs.writeFileSync(
    __dirname + "/../utils/accessToken.json",
    JSON.stringify(token)
  );
  return __dirname;
}

function tokenFsRead() {
  return JSON.parse(
    fs.readFileSync(__dirname + "/../utils/accessToken.json", "utf8")
  );
}

function takeOutData(data) {
  return data["data"];
}

function parameterIsUndefinded(a) {
  return a === undefined;
}

function stopNutrientCommand(actu) {
  let commandList = [
    actu.nutrient.act["stop"],
    actu.nutrient.notUseLine["line_1"],
    actu.nutrient.notUseLine["line_2"],
    actu.nutrient.notUseLine["line_3"],
    actu.nutrient.notUseLine["line_4"],
    actu.nutrient.notUse["notUseDetail_1"],
    actu.nutrient.notUse["notUseDetail_2"],
  ];

  return commandList;
}

function whereToSupply(matter, line) {
  let commandList = [];

  if (matter === "water") {
    commandList.push(actu.nutrient.use.useDetail_1);
    if (line === 1) {
      commandList.push(actu.nutrient.useLine.line_1);
    } else if (line === 2) {
      commandList.push(actu.nutrient.useLine.line_2);
    } else if (line === 3) {
      commandList.push(actu.nutrient.useLine.line_3);
    } else if (line === 4) {
      commandList.push(actu.nutrient.useLine.line_4);
    }
  } else {
    commandList.push(actu.nutrient.use.useDetail_2);
    if (line === 1) {
      commandList.push(actu.nutrient.useLine.line_1);
    } else if (line === 2) {
      commandList.push(actu.nutrient.useLine.line_2);
    } else if (line === 3) {
      commandList.push(actu.nutrient.useLine.line_3);
    } else if (line === 4) {
      commandList.push(actu.nutrient.useLine.line_4);
    }
  }

  commandList.push(actu.nutrient.act.run);

  return commandList;
}

function createCharacter(deviceName, active) {
  let content = deviceName + " 을(를)";

  if (active === "open") {
    content += " 열었습니다.";
  } else if (active === "close") {
    content += " 닫았습니다.";
  } else if (active === "on") {
    content += " 작동하였습니다.";
  } else if (active === "stop") {
    content += " 중지하였습니다.";
  }

  return content;
}

function isNutrientSupplyFnParamsAValid(matter, line) {
  if (isMatterAValid(matter) && isLineAValid(line)) {
    return false;
  } else {
    return true;
  }
}

function isMatterAValid(matter) {
  if (matter === "water" || matter === "fertilizer") {
    return true;
  } else {
    return false;
  }
}

function isLineAValid(line) {
  if (line === 1 || line === 2 || line === 3 || line === 4) {
    return true;
  } else {
    return false;
  }
}

function isUndefinedParams(matter, line) {
  if (matter === undefined || line === undefined) {
    return true;
  } else {
    return false;
  }
}

function findSensorInformationId(filteringData) {
  for (let i of filteringData) {
    if (i.name === "outTemp") {
      return 1;
    } else if (i.name === "actPow") {
      return 40;
    }
  }
}

function dateChecker(start_date, end_date) {
  return (
    moment(start_date).format("YYYYMMDD") === "Invalid date" ||
    moment(end_date).format("YYYYMMDD") === "Invalid date" ||
    Number(moment(start_date).format("YYYYMMDD")) >
      Number(moment(end_date).format("YYYYMMDD"))
  );
}

function addEndDate(endDatetime) {
  let endDate = endDatetime;
  const putData = moment(endDate);
  const momentDatetime = putData.format("HH:mm:ss");

  if (momentDatetime == "00:00:00") {
    return momentAddDatetime(endDate, "days");
  } else {
    return putData.add(1, "hours").format("YYYY-MM-DD HH:mm:ss");
  }
}

function momentAddDatetime(endDate, key) {
  return moment(endDate).add(1, key).format("YYYY-MM-DD HH:mm:ss");
}

function writeNutrientSupplyContent(matter, line) {
  return `양액기에서 ${matter}을(를) ${line}라인에 공급합니다.`;
}

function writeNutrientStopContent() {
  return `양액기에서 공급을 중단합니다.`;
}

function emergencyContent() {
  return "비상정지했습니다.";
}

function pickUpInsideData(filteringData, insertDate) {
  let b = [];
  for (let i of filteringData) {
    if (i["name"] === "co2Temp") {
      b.push(findName(i, "co2Temp", insertDate));
    } else if (i["name"] === "co2Humi") {
      b.push(findName(i, "co2Humi", insertDate));
    } else if (i["name"] === "inInsol") {
      b.push(findName(i, "inInsol", insertDate));
    } else if (i["name"] === "co2") {
      b.push(findName(i, "co2", insertDate));
    }
  }

  return b;
}

function pickUpOutsideData(filteringData, insertDate) {
  let b = [];
  for (let i of filteringData) {
    if (i["name"] === "outTemp") {
      b.push(findName(i, "outTemp", insertDate));
    } else if (i["name"] === "outHumi") {
      b.push(findName(i, "outHumi", insertDate));
    } else if (i["name"] === "outInsol") {
      b.push(findName(i, "outInsol", insertDate));
    } else if (i["name"] === "ws") {
      b.push(findName(i, "ws", insertDate));
    } else if (i["name"] === "rf") {
      b.push(findName(i, "rf", insertDate));
    }
  }

  return b;
}

function findName(i, name, insertDate) {
  return {
    sensor_name: name,
    sensor_data_value: i["value"],
    sensor_data_created_at: insertDate,
  };
}

function normalService(result) {
  const response = {
    header: headerStatusCode.normalService,
  };

  // if (result["body"] != undefined) {
  //   if (result["body"] > 0) {
  //     response.body = result[0];
  //   }
  // }

  return response;
}

function invalidRequestParameterError() {
  const response = {
    header: headerStatusCode.invalidRequestParameterError,
  };

  return response;
}

function fanInvalidRequestParameterError() {
  const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
  const resDatetime = moment().format("YYYY-MM-DD T HH:mm:ss");

  const response = {
    header: {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    },
    body: [{ device: "fan" }],
  };

  return response;
}

function hasItbeenUpdated(result) {
  const response = {
    header: {},
  };

  if (result[0].affectedRows > 0) {
    response.header = headerStatusCode.normalService;
  } else {
    response.header = headerStatusCode.invalidRequestParameterError;
  }

  return response;
}

function deliverDataFormatWrite(actu) {
  const ctl = {
    farmlandId: 1,
    data: [
      {
        bedId: 5,
        device: "nuctrl",
        active: "nctrl_write",
        deviceName: "nutrient",
        dev_data: stopNutrientCommand(actu),
        datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
      },
    ],
  };

  return ctl;
}

function deliverDataFormatRead(wantData) {
  const dataFormat = actu.readNutrient[wantData];
  const ctl = {
    farmlandId: 1,
    data: [
      {
        bedId: 5,
        device: "nuctrl",
        active: "nuctrl_read",
        deviceName: "nutrient",
        datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
        dev_data: dataFormat,
      },
    ],
  };

  return ctl;
}

function responseHeaderAndBody(data) {
  const response = {
    header: headerStatusCode.normalService,
    body: data,
  };

  return response;
}

function whatLine(line) {
  let command;
  if (line === 1) {
    command = actu.supply.list["line_1"];
  } else if (line === 2) {
    command = actu.supply.list["line_2"];
  } else if (line === 3) {
    command = actu.supply.list["line_3"];
  } else if (line === 4) {
    command = actu.supply.list["line_4"];
  }

  const ctl = {
    farmlandId: 1,
    data: [
      {
        bedId: 5,
        device: "nuctrl",
        active: "nctrl_read",
        deviceName: "nutrient",
        dev_data: [command],
        datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
      },
    ],
  };

  return ctl;
}

function arrayCondition(i, data) {
  return [
    data[i]["matter"],
    data[i]["line"],
    data[i]["supplyDatetime"],
    data[i]["supply"],
  ];
}

function twoHourData(
  matter,
  line,
  startSupplyDatetime,
  endSupplyDatetime,
  minutePerLitter
) {
  return [
    {
      matter: matter,
      line: line,
      supply_date_time: startSupplyDatetime.format("YYYY-MM-DD HH"),
      supply:
        moment(endSupplyDatetime.format("YYYY-MM-DD HH:00:00")).diff(
          startSupplyDatetime,
          "minutes"
        ) * minutePerLitter,
    },
    {
      matter: matter,
      line: line,
      supply_date_time: endSupplyDatetime.format("YYYY-MM-DD HH"),
      supply:
        moment(endSupplyDatetime.format("YYYY-MM-DD HH:00:00")).diff(
          endSupplyDatetime,
          "minutes"
        ) * minutePerLitter,
    },
  ];
}

function readNutreint(params) {
  const ctrl = {
    farmland_id: 1,
    data: [
      {
        bed_id: 5,
        device: "nuctrl",
        active: "nuctrl_read",
        device_name: "nutrient",
        datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
        dev_data: params,
      },
    ],
  };

  return ctrl;
}

function writeNutreint(params) {
  const ctrl = {
    farmland_id: 1,
    data: [
      {
        bed_id: 5,
        device: "nuctrl",
        active: "nuctrl_write",
        device_name: "nutrient",
        datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
        dev_data: params,
      },
    ],
  };

  return ctrl;
}

function hoursSensorDataFilter(what) {
  let id1;
  let id2;

  if (what === "temperature") {
    id1 = 1;
    id2 = 31;
  } else if (what === "humidity") {
    id1 = 2;
    id2 = 32;
  } else if (what === "insolation") {
    id1 = 5;
    id2 = 6;
  } else if (what === "co2") {
    id1 = 30;
  }

  return { id1, id2 };
}

function nutrientMultipleConditions(i, data) {
  let condition = [data[i]["value"], data[i]["address"]];
  return condition;
}

function nutrientStatusCode(result, reqDatetime, resDatetime) {
  const response = {
    header: {},
  };

  if (result.data.header.resultCode == "00") {
    response.header = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    };
    response.body = [{ device: "nutrient" }];
  } else {
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    };
    response.body = [{ device: "nutrient" }];
  }

  return response;
}

function communicationError(device) {
  const response = {
    header: {},
  };

  response.header = {
    resultCode: "11",
    resultMsg: "COMMUNICATION_ERROR",
    requestDatetime: reqDatetime,
    responseDatetime: resDatetime,
  };
  response.body = [{ device: device }];
  return response;
}

function normalServiceIncludBody(result, reqDatetime, resDatetime) {
  const response = {
    header: {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    },
    body: result[0],
  };
  return response;
}

function normalServiceAndNoDataError(result, reqDatetime, resDatetime) {
  if (result[0].length > 0) {
    const response = {
      header: {
        resultCode: "00",
        resultMsg: "NORMAL_SERVICE",
        requestDatetime: reqDatetime,
        responseDatetime: resDatetime,
      },
      body: result[0],
    };
    return response;
  } else if (result[0] == 0) {
    const response = {
      header: {
        resultCode: "02",
        resultMsg: "NO_DATA_ERROR",
        requestDatetime: reqDatetime,
        responseDatetime: resDatetime,
      },
    };
    return response;
  }
}

function currentValueFsRead() {
  return JSON.parse(
    fs.readFileSync(__dirname + "/../utils/currentValue.json", "utf8")
  );
}

function currentValueFsWrite(what, status) {
  const currentFile = currentValueFsRead();
  currentFile[what]["status"] = status;
  fs.writeFileSync(
    __dirname + "/../utils/currentValue.json",
    JSON.stringify(currentFile)
  );
}

function deviceStatus() {
  const result = fsRead();
  const onList = [];

  if (result.fan1.status == "on") {
    console.log("fan1은 on이다");
    onList.push("fan1");
  }
  if (result.fan2.status == "on") {
    console.log("fan2은 on이다");
    onList.push("fan2");
  }
  if (result.fan3.status == "on") {
    console.log("fan3은 on이다");
    onList.push("fan3");
  }
  if (result.nutrient.status == "on") {
    console.log("nutrient은 on이다");
    onList.push("nutrient");
  }

  return onList;
}

function addCurrent(onList) {
  let curr = 0.7;
  const oneFanValue = 0.3;
  const twoFanValue = 0.7;
  const threeFanValue = 1.1;
  const nutrientValue = 5;

  if (onList.includes("fan1")) {
    curr += oneFanValue;
    if (onList.includes("fan2")) {
      curr += twoFanValue;
      if (onList.includes("fan3")) {
        curr += threeFanValue;
      }
    } else if (onList.includes("fan3")) {
      curr += twoFanValue;
    }
  } else if (onList.includes("fan2")) {
    curr += oneFanValue;
    if (onList.includes("fan1")) {
      curr += twoFanValue;
      if (onList.includes("fan3")) {
        curr += threeFanValue;
      }
    } else if (onList.includes("fan3")) {
      curr += twoFanValue;
    }
  } else if (onList.includes("fan3")) {
    curr += oneFanValue;
    if (onList.includes("fan2")) {
      curr += twoFanValue;
      if (onList.includes("fan1")) {
        curr += threeFanValue;
      }
    } else if (onList.includes("fan1")) {
      curr += twoFanValue;
    }
  }

  if (onList.includes("nutrient")) {
    curr += nutrientValue;
  }

  return curr.toFixed(1);
}

function invalidInsideMainSensorData(list) {
  try {
    const inTemp = "inTemp";
    const inHumi = "inHumi";
    const inInsol = "inInsol";
    const co2 = "co2";
    const invalidList = [inTemp, inHumi, inInsol, co2];
    const sortBy = [inTemp, inHumi, inInsol, co2];
    const sortArr = [];

    let datetime;
    let onlyOnce = true;

    const result = list.map((data) => {
      if (onlyOnce) {
        datetime = data.sensor_data_created_at;
        onlyOnce = false;
      }
      if (data.sensor_name == inTemp) {
        removeFromArray(invalidList, inTemp);

        return data;
      } else if (data.sensor_name == inHumi) {
        removeFromArray(invalidList, inHumi);

        return data;
      } else if (data.sensor_name == inInsol) {
        removeFromArray(invalidList, inInsol);

        return data;
      } else if (data.sensor_name == co2) {
        removeFromArray(invalidList, co2);

        return data;
      }
    });

    if (invalidList.length > 0) {
      addNullData(invalidList, result, datetime);
    }

    for (let sortByData of sortBy) {
      for (let resultData of result) {
        if (resultData.sensor_name == sortByData) {
          sortArr.push(resultData);
        }
      }
    }

    return sortArr;
  } catch (error) {
    console.log(error);
  }
}

function invalidOutsideMainSensorData(list) {
  const sensorName1 = "outTemp";
  const sensorName2 = "outHumi";
  const sensorName3 = "rf";
  const sensorName4 = "outInsol";
  const sensorName5 = "ws";
  const invalidList = [
    sensorName1,
    sensorName2,
    sensorName3,
    sensorName4,
    sensorName5,
  ];
  const sortBy = [
    sensorName1,
    sensorName2,
    sensorName3,
    sensorName4,
    sensorName5,
  ];
  const sortArr = [];

  let datetime;
  let onlyOnce = true;

  const result = list.map((data) => {
    if (onlyOnce) {
      datetime = data.sensor_data_created_at;
      onlyOnce = false;
    }
    if (data.sensor_name == sensorName1) {
      removeFromArray(invalidList, sensorName1);

      return data;
    } else if (data.sensor_name == sensorName2) {
      removeFromArray(invalidList, sensorName2);

      return data;
    } else if (data.sensor_name == sensorName3) {
      removeFromArray(invalidList, sensorName3);

      return data;
    } else if (data.sensor_name == sensorName4) {
      removeFromArray(invalidList, sensorName4);

      return data;
    } else if (data.sensor_name == sensorName5) {
      removeFromArray(invalidList, sensorName5);

      return data;
    }
  });

  if (invalidList.length > 0) {
    addNullData(invalidList, result, datetime);
  }

  for (let sortByData of sortBy) {
    for (let resultData of result) {
      if (resultData.sensor_name == sortByData) {
        sortArr.push(resultData);
      }
    }
  }

  return sortArr;
}

function addNullData(invalidList, result, datetime) {
  for (let data of invalidList) {
    result.push({
      sensor_name: data,
      sensor_data_value: null,
      sensor_data_created_at: datetime,
    });
  }
}

function removeFromArray(invalidList, sensorName) {
  const idx = invalidList.indexOf(sensorName);

  if (idx > -1) {
    invalidList.splice(idx, 1);
  }
}

function isDeviceName(deviceName) {
  const deviceNameList = [
    "fan1",
    "fan2",
    "fan3",
    "shutter1",
    "shutter2",
    "shutter3",
    "shutter4",
    "shutter5",
    "shutter6",
    "shutter7",
  ];

  if (deviceNameList.includes(deviceName)) {
    return false;
  } else {
    return true;
  }
}

function choiceQuery(startDate) {
  const startDateMomentFormat = Number(
    moment(startDate).format("YYYYMMDDHHmmss")
  );
  const temperatureCriteria = 20220614120000;
  const humidityCriteria = 20220614140000;

  if (startDateMomentFormat < temperatureCriteria) {
    console.log("온 습도 같이");
    return "3";
  } else if (startDateMomentFormat < humidityCriteria) {
    console.log("습도만");
    return "2";
  } else {
    console.log("3,4 없이");
    return "1";
  }
}

function changeSensorInformationId(id, data) {
  return {
    sensor_information_id: id,
    sensor_data_value: data["sensor_data_value"],
    sensor_data_created_at: data["sensor_data_created_at"],
  };
}

function idDateSort(changeResult) {
  return changeResult.sort((a, b) => {
    const aId = a.sensor_information_id;
    const bId = b.sensor_information_id;
    const aDate = a.sensor_data_created_at;
    const bDate = b.sensor_data_created_at;

    if (bId < aId) return 1;
    if (bId > aId) return -1;
    if (bDate < aDate) return 1;
    if (bDate > aDate) return -1;
    return 0;
  });
}

function idReplace(result) {
  return result[0].map((data) => {
    if (data["sensor_information_id"] == 3) {
      return this.changeSensorInformationId(31, data);
    } else if (data["sensor_information_id"] == 4) {
      return this.changeSensorInformationId(32, data);
    } else {
      return data;
    }
  });
}

function tempEndDate(endDate) {
  const temperatureDate = "2022-06-14 12:00:00";
  if (Number(moment(endDate).format("YYYYMMDDHHmmss")) < 20220614120000) {
    return endDate;
  } else {
    return temperatureDate;
  }
}

function humiEndDate(endDate) {
  const humidityDate = "2022-06-14 14:00:00";
  if (Number(moment(endDate).format("YYYYMMDDHHmmss")) < 20220614140000) {
    return endDate;
  } else {
    return humidityDate;
  }
}

function tempHumiEndDate(endDate) {
  return {
    tempEndDate: this.tempEndDate(endDate),
    humiEndDate: this.humiEndDate(endDate),
  };
}

module.exports = {
  responseHeaderAndBody,
  nutrientStatusCode,
  convertBufferDataToJsonFormat,
  multipleConditions,
  dataExtraction,
  whatLine,
  convertJsonInArrayToJson,
  dataExistsOrNot,
  responseHeaderNormalServiceOrNotDataError,
  requestWithToken,
  takeOutData,
  reissuanceToken,
  parameterIsUndefinded,
  deliverDataFormatWrite,
  stopNutrientCommand,
  whereToSupply,
  createCharacter,
  isNutrientSupplyFnParamsAValid,
  findSensorInformationId,
  addEndDate,
  writeNutrientSupplyContent,
  writeNutrientStopContent,
  emergencyContent,
  isUndefinedParams,
  pickUpInsideData,
  invalidRequestParameterError,
  hasItbeenUpdated,
  normalService,
  deliverDataFormatRead,
  arrayCondition,
  twoHourData,
  readNutreint,
  writeNutreint,
  hoursSensorDataFilter,
  nutrientMultipleConditions,
  fanInvalidRequestParameterError,
  communicationError,
  normalServiceIncludBody,
  pickUpOutsideData,
  dateChecker,
  normalServiceAndNoDataError,
  currentValueFsRead,
  currentValueFsWrite,
  addCurrent,
  deviceStatus,
  invalidInsideMainSensorData,
  invalidOutsideMainSensorData,
  isDeviceName,
  choiceQuery,
  changeSensorInformationId,
  idDateSort,
  idReplace,
  tempEndDate,
  humiEndDate,
  tempHumiEndDate,
};
