const headerStatusCode = require("../utils/headerStatusCode.js");
const fs = require("fs");
const Token = require("../models/Token");
const actu = require("../utils/actuator");
const moment = require("moment");
const e = require("express");
const logger = require("../config/logger.js");

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

function multipleConditionId(i, convertData, insertDate) {
  let condition = [convertData[i]["id"], convertData[i]["value"], insertDate];
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
  let content = "";

  if (deviceName === "oneTwo") {
    content += "???1, ???2???(???)";
  } else if (deviceName === "oneThree") {
    content += "???1, ???3???(???)";
  } else if (deviceName === "twoThree") {
    content += "???2, ???3???(???)";
  } else if (deviceName === "oneTwoThree") {
    content += "???1, ???2, ???3???(???)";
  } else {
  }
  content += " ???(???)";
  if (active === "open") {
    content += " ???????????????.";
  } else if (active === "close") {
    content += " ???????????????.";
  } else if (active === "on") {
    content += " ?????????????????????.";
  } else if (active === "stop") {
    content += " ?????????????????????.";
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
  const regex = RegExp(
    /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])\s\d{2}:\d{2}:\d{2}/
  );
  return (
    moment(start_date).format("YYYYMMDDHHmmss") === "Invalid date" ||
    moment(end_date).format("YYYYMMDDHHmmss") === "Invalid date" ||
    Number(moment(start_date).format("YYYYMMDDHHmmss")) >
      Number(moment(end_date).format("YYYYMMDDHHmmss")) ||
    !regex.test(start_date) ||
    !regex.test(end_date)
  );
}

function addEndDate(endDatetime) {
  let endDate = endDatetime;
  const nowDate = moment().format("YYYYMMDDHHmmss");
  const nowTime = moment().format("HH");

  if (
    Number(moment(endDate).format("YYYYMMDDHHmmss")) > Number(nowDate) ||
    Number(moment(endDate).format("HH")) === Number(nowTime)
  ) {
    return moment().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss");
  }
  return momentAddDatetime(endDate, "seconds");
}

function momentAddDatetime(endDate, key) {
  return moment(endDate).add(1, key).format("YYYY-MM-DD HH:mm:ss");
}

function writeNutrientSupplyContent(matter, line) {
  return `??????????????? ${matter}???(???) ${line}????????? ???????????????.`;
}

function writeNutrientStopContent() {
  return `??????????????? ????????? ???????????????.`;
}

function emergencyContent() {
  return "????????????????????????.";
}

function pickUpInsideData(filteringData, insertDate) {
  let b = [];
  for (let i of filteringData) {
    if (i["name"] === "co2Temp") {
      const value = Number(i["value"]);
      b.push({
        sensor_name: "co2Temp",
        sensor_data_value: value.toFixed(1),
        sensor_data_created_at: insertDate,
      });
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
      const value = Number(i["value"]);
      b.push({
        sensor_name: "outTemp",
        sensor_data_value: value.toFixed(1),
        sensor_data_created_at: insertDate,
      });
    } else if (i["name"] === "outHumi") {
      b.push(findName(i, "outHumi", insertDate));
    } else if (i["name"] === "outInsol") {
      b.push(findName(i, "outInsol", insertDate));
    } else if (i["name"] === "ws") {
      const value = Number(i["value"]);
      b.push({
        sensor_name: "ws",
        sensor_data_value: value.toFixed(1),
        sensor_data_created_at: insertDate,
      });
    } else if (i["name"] === "rf") {
      const value = Number(i["value"]);
      b.push({
        sensor_name: "rf",
        sensor_data_value: value.toFixed(1),
        sensor_data_created_at: insertDate,
      });
    }
  }

  return b;
}

function pickUpEcPhData(filteringData, insertDate) {
  let b = [];
  for (let i of filteringData) {
    if (i["name"] === "soilEc1") {
    }
  }
}

function findName(i, name, insertDate) {
  const value = Number(i["value"]);
  return {
    sensor_name: name,
    sensor_data_value: value.toFixed(0),
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
  console.log("invalidRequestParmeterError ???");
  const response = {
    header: headerStatusCode.invalidRequestParameterError,
  };

  return response;
}

function fanInvalidRequestParameterError() {
  console.log("error ??? INVALID_REQUEST_PARAMETER_ERROR");
  const reqDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
  const resDatetime = moment().format("YYYY-MM-DD HH:mm:ss");

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

function communicationError(device, reqDatetime, resDatetime) {
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

function normalServiceIncludBodyProcedure(result, reqDatetime, resDatetime) {
  const response = {
    header: {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    },
    body: result[0][0],
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

function currentValueFsWrite(what, b) {
  console.log("waht : ", what)
  console.log("value : ", b)
  const currentFile = currentValueFsRead();
  currentFile[what].status = b;
  fs.writeFileSync(
    __dirname + "/../utils/currentValue.json",
    JSON.stringify(currentFile)
  );
}

function deviceStatus() {
  const result = currentValueFsRead();
  const onList = [];

  if (result.fan1.status == "on") {
    console.log("fan1??? on??????");
    onList.push("fan1");
  }
  if (result.fan2.status == "on") {
    console.log("fan2??? on??????");
    onList.push("fan2");
  }
  if (result.fan3.status == "on") {
    console.log("fan3??? on??????");
    onList.push("fan3");
  }
  if (result.nutrient.status == "on") {
    console.log("nutrient??? on??????");
    onList.push("nutrient");
  }

  return onList;
}

function addCurrent(onList) {
  let curr = 0.5;
  const oneFanValue = 0.2;
  const twoFanValue = 0.2;
  const threeFanValue = 0.2;
  const nutrientValue = 3.6;

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

function addCurrentOff(onList) {
  let curr = 1.5;
  const oneFanValue = 0.6;
  const twoFanValue = 1.1;
  const threeFanValue = 1.7;
  const nutrientValue = 6;

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

  return Number(curr.toFixed(1));
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

function isDeviceNameAndActive(deviceName, active) {
  if (
    deviceName == "fan1" ||
    deviceName == "fan2" ||
    deviceName == "fan3" ||
    deviceName == "oneTwo" ||
    deviceName == "oneThree" ||
    deviceName == "twoThree" ||
    deviceName == "oneTwoThree"
  ) {
    if (active == "on" || active == "stop") {
      return false;
    } else {
      return true;
    }
  } else if (
    deviceName == "shutter1" ||
    deviceName == "shutter2" ||
    deviceName == "shutter3" ||
    deviceName == "shutter4" ||
    deviceName == "shutter5" ||
    deviceName == "shutter6" ||
    deviceName == "shutter7"
  ) {
    if (active == "open" || active == "close" || active == "stop") {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

function statisticsStatusCode(result, reqDatetime, resDatetime) {
  const response = {
    header: {},
  };
  if (this.dataExistsOrNot(result)) {
    response.header = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    };
    response.body = result[0];
  } else if (!this.dataExistsOrNot(result)) {
    response.header = {
      resultCode: "02",
      resultMsg: "NO_DATA_ERROR",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    };
  }

  return response;
}

function procedureResultStatusCode(result, reqDatetime, resDatetime) {
  const response = {
    header: {},
  };
  if (this.dataExistsOrNot(result)) {
    response.header = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    };
    response.body = result[0][0];
  } else if (!this.dataExistsOrNot(result)) {
    response.header = {
      resultCode: "02",
      resultMsg: "NO_DATA_ERROR",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    };
  }

  return response;
}

function statisticsStatusCodeInvalidRequestPararmeterError(
  reqDatetime,
  resDatetime
) {
  const response = {
    header: {},
  };
  response.header = {
    resultCode: "10",
    resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    requestDatetime: reqDatetime,
    responseDatetime: resDatetime,
  };

  return response;
}

function transDecimalAndIntegerMainOutsideSensorData(result) {
  const transResult = result[0].map((data) => {
    if (
      data["sensor_name"] == "outTemp" ||
      data["sensor_name"] == "ws" ||
      data["sensor_name"] == "rf"
    ) {
      return {
        sensor_name: data["sensor_name"],
        sensor_data_value: Number(data["sensor_data_value"]).toFixed(1),
        sensor_data_created_at: data["sensor_data_created_at"],
      };
    } else {
      return {
        sensor_name: data["sensor_name"],
        sensor_data_value: Number(data["sensor_data_value"]).toFixed(0),
        sensor_data_created_at: data["sensor_data_created_at"],
      };
    }
  });
  return transResult;
}

function transDecimalAndIntegerMainInsideSensorData(result) {
  const transResult = result[0].map((data) => {
    if (data["sensor_name"] == "co2Temp") {
      return {
        sensor_name: data["sensor_name"],
        sensor_data_value: Number(data["sensor_data_value"]).toFixed(1),
        sensor_data_created_at: data["sensor_data_created_at"],
      };
    } else {
      return {
        sensor_name: data["sensor_name"],
        sensor_data_value: Number(data["sensor_data_value"]).toFixed(0),
        sensor_data_created_at: data["sensor_data_created_at"],
      };
    }
  });
  return transResult;
}

function timeOutError() {
  return {
    header: {
      resultCode: "04",
      resultMsg: "TIME_OUT_ERROR",
    },
  };
}

function noId(readData) {
  const list = readData;
  let id = [
    1, 2, 5, 6, 7, 8, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    28, 29, 30, 31, 32,
  ];

  for (let i of list) {
    if (i["sensor_information_id"] === 1) {
      id = id.filter((data) => {
        return data !== 1;
      });
    } else if (i["sensor_information_id"] === 2) {
      id = id.filter((data) => {
        return data !== 2;
      });
    } else if (i["sensor_information_id"] === 5) {
      id = id.filter((data) => {
        return data !== 5;
      });
    } else if (i["sensor_information_id"] === 6) {
      id = id.filter((data) => {
        return data !== 6;
      });
    } else if (i["sensor_information_id"] === 7) {
      id = id.filter((data) => {
        return data !== 7;
      });
    } else if (i["sensor_information_id"] === 8) {
      id = id.filter((data) => {
        return data !== 8;
      });
    } else if (i["sensor_information_id"] === 14) {
      id = id.filter((data) => {
        return data !== 14;
      });
    } else if (i["sensor_information_id"] === 15) {
      id = id.filter((data) => {
        return data !== 15;
      });
    } else if (i["sensor_information_id"] === 16) {
      id = id.filter((data) => {
        return data !== 16;
      });
    } else if (i["sensor_information_id"] === 17) {
      id = id.filter((data) => {
        return data !== 17;
      });
    } else if (i["sensor_information_id"] === 18) {
      id = id.filter((data) => {
        return data !== 18;
      });
    } else if (i["sensor_information_id"] === 19) {
      id = id.filter((data) => {
        return data !== 19;
      });
    } else if (i["sensor_information_id"] === 20) {
      id = id.filter((data) => {
        return data !== 20;
      });
    } else if (i["sensor_information_id"] === 21) {
      id = id.filter((data) => {
        return data !== 21;
      });
    } else if (i["sensor_information_id"] === 22) {
      id = id.filter((data) => {
        return data !== 22;
      });
    } else if (i["sensor_information_id"] === 23) {
      id = id.filter((data) => {
        return data !== 23;
      });
    } else if (i["sensor_information_id"] === 24) {
      id = id.filter((data) => {
        return data !== 24;
      });
    } else if (i["sensor_information_id"] === 25) {
      id = id.filter((data) => {
        return data !== 25;
      });
    } else if (i["sensor_information_id"] === 26) {
      id = id.filter((data) => {
        return data !== 26;
      });
    } else if (i["sensor_information_id"] === 27) {
      id = id.filter((data) => {
        return data !== 27;
      });
    } else if (i["sensor_information_id"] === 28) {
      id = id.filter((data) => {
        return data !== 28;
      });
    } else if (i["sensor_information_id"] === 29) {
      id = id.filter((data) => {
        return data !== 29;
      });
    } else if (i["sensor_information_id"] === 30) {
      id = id.filter((data) => {
        return data !== 30;
      });
    } else if (i["sensor_information_id"] === 31) {
      id = id.filter((data) => {
        return data !== 31;
      });
    } else if (i["sensor_information_id"] === 32) {
      id = id.filter((data) => {
        return data !== 32;
      });
    }
  }

  return id;
}

function insertNull(id) {
  let saveDataList = [];
  const time = moment().subtract(1, "minutes").format("YYYY-MM-DD HH:mm:ss");
  if (id.length > 0) {
    for (let j of id) {
      saveDataList.push({
        id: j,
        value: null,
      });
    }
  }

  return { saveDataList, time };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function simpleResultStatusNormal(reqDatetime, resDatetime, device) {
  const response = {
    header: {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    },
    body: [{ device }],
  };

  return response;
}

function simpleResultStatusNotWorking(reqDatetime, resDatetime, device) {
  const response = {
    header: {
      resultCode: "40",
      resultMsg: "NOT_WORKING",
      requestDatetime: reqDatetime,
      responseDatetime: resDatetime,
    },
    body: [{ device }],
  };

  return response;
}

function invalidActionSettingValue(body) {
  let result = false;

  const invalidCheck = [
    "num1Time",
    "num1Temperature",
    "num1Humidity",
    "num2Time",
    "num2Temperature",
    "num2Humidity",
    "num3Time",
    "num3Temperature",
    "num3Humidity",
    "num4Time",
    "num4Temperature",
    "num4Humidity",
    "num5Time",
    "num5Temperature",
    "num5Humidity",
    "num6Time",
    "num6Temperature",
    "num6Humidity",
    "num7Time",
    "num7Temperature",
    "num7Humidity",
    "num8Time",
    "num8Temperature",
    "num8Humidity",
    "num9Time",
    "num9Temperature",
    "num9Humidity",
    "num10Time",
    "num10Temperature",
    "num10Humidity",
    "num11Time",
    "num11Temperature",
    "num11Humidity",
    "num12Time",
    "num12Temperature",
    "num12Humidity",
    "num13Time",
    "num13Temperature",
    "num13Humidity",
    "num14Time",
    "num14Temperature",
    "num14Humidity",
    "num15Time",
    "num15Temperature",
    "num15Humidity",
    "num16Time",
    "num16Temperature",
    "num16Humidity",
    "num17Time",
    "num17Temperature",
    "num17Humidity",
    "num18Time",
    "num18Temperature",
    "num18Humidity",
    "num19Time",
    "num19Temperature",
    "num19Humidity",
    "num20Time",
    "num20Temperature",
    "num20Humidity",
    "ws",
    "rf",
    "outTemp",
    "outInsol",
    "num1Insolation",
    "num2Insolation",
    "num3Insolation",
    "num4Insolation",
    "num5Insolation",
    "num6Insolation",
    "num7Insolation",
    "num8Insolation",
    "num9Insolation",
    "num10Insolation",
    "num11Insolation",
    "num12Insolation",
    "num13Insolation",
    "num14Insolation",
    "num15Insolation",
    "num16Insolation",
    "num17Insolation",
    "num18Insolation",
    "num19Insolation",
    "num20Insolation",
    "num21Time",
    "num21Temperature",
    "num21Humidity",
    "num21Insolation",
    "num22Time",
    "num22Temperature",
    "num22Humidity",
    "num22Insolation",
    "num23Time",
    "num23Temperature",
    "num23Humidity",
    "num23Insolation",
    "num0Time",
    "num0Temperature",
    "num0Humidity",
    "num0Insolation",
  ];

  const list = Object.keys(body);
  const checkList = [];

  if (list.length === 0) {
    result = true;
    return result;
  }

  for (let i of list) {
    if (invalidCheck.includes(i)) {
      checkList.push(i);
    }
    if (i.slice(4, 20) === "Time") {
      const timeHour = i.split(":")[0];
      const timeMinute = i.split(":")[1];

      if (Number(timeHour) > 23 || Number(timeHour) < 0) {
        console.log("timeHour ?????????");
        result = true;
        break;
      }
      if (Number(timeMinute) > 59 || Number(timeMinute) < 0) {
        console.log("timeMinute ?????????");
        result = true;
        break;
      }
    } else if (i.slice(4, 20) === "Temperature") {
      const tempMin = i.split(":")[0];
      const tempMax = i.split(":")[1];

      if (
        Number(tempMax) > 85 ||
        Number(tempMax) < -25 ||
        Number(tempMin) > 85 ||
        Number(tempMin) < -25 ||
        Number(tempMin) > Number(tempMax)
      ) {
        console.log("Temperature ?????????");
        result = true;
        break;
      }
    } else if (i.slice(4, 20) === "Humidity") {
      const humiMin = i.split("-")[0];
      const humiMax = i.split("-")[1];

      if (
        Number(humiMin) > 100 ||
        Number(humiMin) < 0 ||
        Number(humiMax) > 100 ||
        Number(humiMax) < 0 ||
        Number(humiMin) > Number(humiMax)
      ) {
        console.log("Humidity ?????????");
        result = true;
        break;
      }
    } else if (i.slice(4, 20) === "Insolation") {
      const insolMin = i.split("-")[0];
      const insolMax = i.split("-")[1];
      if (
        Number(insolMin) > 1500 ||
        Number(insolMin) < 0 ||
        Number(insolMax) > 1500 ||
        Number(insolMax) < 0 ||
        Number(insolMin) > Number(insolMax)
      ) {
        console.log("Humidity ?????????");
        result = true;
        break;
      }
    } else if (i === "ws") {
      if (Number(body[i]) > 60 || Number(body[i]) < 0) {
        console.log("windSpeed ?????????");
        result = true;
        break;
      }
    } else if (i === "rf") {
      if (Number(body[i]) > 400 || Number(body[i]) < 0) {
        console.log("rainFall ?????????");
        result = true;
        break;
      }
    } else if (i === "outTemp") {
      if (Number(body[i]) > 60 || Number(body[i]) < -40) {
        console.log("temperature ?????????");
        result = true;
        break;
      }
    } else if (i === "outInsol") {
      if (Number(body[i]) > 1500 || Number(body[i]) < 0) {
        console.log("insolation ?????????");

        result = true;
        break;
      }
    }
  }

  if (list.length !== checkList.length) {
    console.log("JSON ?????? ?????????");
    logger.info(JSON.stringify(list));
    logger.info(JSON.stringify(checkList));
    result = true;
  }

  return result;
}

function selectActionData(body) {
  const list = [];

  for (let i of Object.keys(body)) {
    if (body[i] != "") {
      if (i.slice(4, 20) === "Time") {
        const timeHour = body[i].split(":")[0];
        const timeMinute = body[i].split(":")[1];
        let transTimeHour;
        let transTimeMinute;

        if (Number(timeHour) < 10 && timeHour.length === 1) {
          transTimeHour = "0" + timeHour;
        } else {
          transTimeHour = timeHour;
        }
        if (Number(timeMinute) < 10 && timeMinute.length === 1) {
          transTimeMinute = "0" + timeMinute;
        } else {
          transTimeMinute = timeMinute;
        }

        list.push({
          where: i,
          value: transTimeHour + ":" + transTimeMinute,
        });
      } else {
        list.push({
          where: i,
          value: body[i],
        });
      }
    }
  }

  return list;
}

function readActionStatus() {
  return JSON.parse(
    fs.readFileSync(__dirname + "/../utils/actionSettingValue.json", "utf8")
  );
}

function writeActionStatus(where, value) {
  const fileRead = this.readActionStatus();
  fileRead[where] = value;
  fs.writeFileSync(
    __dirname + "/../utils/actionSettingValue.json",
    JSON.stringify(fileRead)
  );
}

function actionStatus() {
  return JSON.parse(
    fs.readFileSync(__dirname + "/../utils/actionSettingValue.json", "utf8")
  );
}

function detectStatusFsRead() {
  return JSON.parse(
    fs.readFileSync(__dirname + "/../utils/detectStatus.json", "utf8")
  );
}

function detectFsWrite(where, value) {
  const fileRead = detectStatusFsRead();
  fileRead[where] = value;
  fs.writeFileSync(
    __dirname + "/../utils/detectStatus.json",
    JSON.stringify(fileRead)
  );
}

function endTime(value) {
  let endTime = moment()
    .add(Number(value), "minutes")
    .format("YYYY-MM-DD HH:mm:ss");

  const spaceSplit = endTime.split(" ");
  const date = spaceSplit[0].split("-");
  const time = spaceSplit[1].split(":");
  const [hour, minute, second] = time;
  const [year, month, day] = date;

  return { month, day, hour, minute, second };
}

function actionStatusFsRead() {
  return JSON.parse(
    fs.readFileSync(__dirname + "/../utils/detectStatus.json", "utf8")
  );
}

function actionStatusFsWrite(what, status) {
  const currentFile = actionStatusFsRead();
  currentFile[what] = status;
  fs.writeFileSync(
    __dirname + "/../utils/detectStatus.json",
    JSON.stringify(currentFile)
  );
}

function invalidActionStatus(body) {
  const invalidList = [
    "run",
    "coolTime",
    "fanLevel1",
    "fanLevel2",
    "fanLevel3",
    "outTemp",
    "rf",
    "ws",
    "delay",
  ];

  const list = Object.keys(body);
  const checkList = [];
  let result = false;

  for (let i of list) {
    if (invalidList.includes(i)) {
      checkList.push(i);
    }
  }
  if (body["delay"] < 0 || body["delay"] > 99) {
    console.log("delay ?????????");
    result = true;
    return result;
  }
  if (body["run"] < 0 || body["run"] > 99) {
    console.log("run ?????????");
    result = true;
    return result;
  }
  if (body["coolTime"] < 0 || body["coolTime"] > 99) {
    console.log("coolTime ?????????");
    result = true;
    return result;
  }
  if (body["fanLevel1"] < 0 || body["fanLevel1"] > 99) {
    console.log("fanLevel1 ?????????");
    result = true;
    return result;
  }
  if (body["fanLevel2"] < 0 || body["fanLevel2"] > 99) {
    console.log("fanLevel2 ?????????");
    result = true;
    return result;
  }
  if (body["fanLevel3"] < 0 || body["fanLevel3"] > 99) {
    console.log("fanLevel3 ?????????");
    result = true;
    return result;
  }
  if (body["outTemp"] < -25 || body["outTemp"] > 85) {
    console.log("outTemp ?????????");
    result = true;
    return result;
  }
  if (body["rf"] < 0 || body["rf"] > 400) {
    console.log("rf ?????????");
    result = true;
    return result;
  }
  if (body["ws"] < 0 || body["ws"] > 60) {
    console.log("ws ?????????");
    result = true;
    return result;
  }

  if (checkList.length !== list.length) {
    console.log("JSON ?????? ?????????");
    result = true;
    return result;
  }
}

function selectActionStatus(body) {
  const list = [];

  for (let i of Object.keys(body)) {
    if (body[i] != "") {
      list.push({
        where: i,
        value: body[i],
      });
    }
  }

  return list;
}

module.exports = {
  selectActionStatus,
  invalidActionStatus,
  actionStatusFsRead,
  actionStatusFsWrite,
  endTime,
  detectFsWrite,
  detectStatusFsRead,
  actionStatus,
  simpleResultStatusNormal,
  simpleResultStatusNotWorking,
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
  statisticsStatusCode,
  statisticsStatusCodeInvalidRequestPararmeterError,
  isDeviceNameAndActive,
  transDecimalAndIntegerMainOutsideSensorData,
  transDecimalAndIntegerMainInsideSensorData,
  timeOutError,
  procedureResultStatusCode,
  insertNull,
  noId,
  multipleConditionId,
  normalServiceIncludBodyProcedure,
  sleep,
  readActionStatus,
  selectActionData,
  writeActionStatus,
  invalidActionSettingValue,
  addCurrentOff,
};
