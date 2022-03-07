const headerErrorCode = require("../utils/headerStatusCode.js");

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
    response.header = headerErrorCode.normalService;
    response.body = data[0];
  } else {
    response.header = headerErrorCode.noDataError;
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

function sensorDataRealtimeCommunication() {
  const { io } = require("socket.io-client");
  const url = require("../config/url");

  const socket = io(url.SOCKETIO_SERVER_HOST, {
    transports: ["websocket"],
    auth: {
      account: process.env.SOCKETIO_SECRET_KEY, // 계정의 아이디를 넣을 예정
      user: "local",
    },
  });
  socket.on("connect", () => {
    console.log("@@");
  });

  socket.emit("test", "test");

  socket.on("disconnet", () => {
    console.log(socket.id);
  });
}

function takeOutData(data) {
  return data["data"];
}

function emergencyStop() {}

function outRangeDataPush(data) {
  const convertData = convertJsonInArrayToJson(data);
}

module.exports = {
  convertBufferDataToJsonFormat,
  multipleConditions,
  dataExtraction,
  convertJsonInArrayToJson,
  dataExistsOrNot,
  responseHeaderNormalServiceOrNotDataError,
  requestWithToken,
  sensorDataRealtimeCommunication,
  takeOutData,
};
