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

function responseHeaderNormalServiceOrNotDataError(trueAndFalse, data) {
  const response = {
    header: {},
  };
  if (trueAndFalse) {
    response.header = headerStatusCode.normalService;
    response.body = data[0];
  } else {
    response.header = headerStatusCode.noDataError;
    response.body = data[0];
  }

  return response;
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

function addEndDate(endDate) {
  return moment(endDate).add(1, "days").format("YYYY-MM-DD");
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

function pickUpData(filteringData, insertDate) {
  let b = [];
  for (let i of filteringData) {
    if (i["name"] === "inTemp") {
      b.push(findName(i, "inTemp", insertDate));
    } else if (i["name"] === "inHumi") {
      b.push(findName(i, "inHumi", insertDate));
    } else if (i["name"] === "inInsol") {
      b.push(findName(i, "inInsol", insertDate));
    } else if (i["name"] === "co2") {
      b.push(findName(i, "co2", insertDate));
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
    id2 = 3;
  } else if (what === "humidity") {
    id1 = 2;
    id2 = 4;
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

module.exports = {
  responseHeaderAndBody,
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
  pickUpData,
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
};
