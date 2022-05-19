const { io } = require("socket.io-client");
const url = require("../config/url");
const accessToken = require("./accessToken.json");
const { reissuanceToken } = require("../lib/fn");
const ctrl = require("../controllers/loadSensorData");
const ntctrl = require("../controllers/nutrient");

const socket = io(url.SOCKETIO_SERVER_HOST, {
  transports: ["websocket"],
  auth: {
    // account: process.env.SOCKETIO_SECRET_KEY,
    key: accessToken.accessToken,
    user: "local", // 계정의 아이디를 넣을 예정
  },
});

socket.on("connect", () => {
  console.log(socket.id);

  console.log(socket.connected);
});

socket.on("connect_error", (reason) => {
  // socketio 서버가 닫히면 에러 발생 or new Error 객체로 에러 발생
  console.log(reason);
  reissuanceToken();
});

socket.on("disconnect", (reason) => {
  console.log(reason);
  console.log("disconnect");
});

const mainData = io(url.SOCKETIO_MAIN_DATA_SERVER_HOST, {
  transports: ["websocket"],
});

mainData.on("connect", () => {
  console.log(socket.id);
  console.log(socket.connected);
});

mainData.on("connect_error", (reason) => {
  // socketio 서버가 닫히면 에러 발생 or new Error 객체로 에러 발생
  console.log(reason);
  reissuanceToken();
});

mainData.on("requestData", async (data) => {
  console.log(data);
  const result = await ctrl.socketIO.reactFirstMainSensorData();
  mainData.emit("main", result);
});

mainData.on("disconnect", (reason) => {
  console.log(reason);
  console.log("disconnect");
});

const nutrientData = io(process.env.SOCKETIO_NUTRIENT_DATA_SERVER_HOST, {
  transports: ["websocket"],
});

nutrientData.on("connect", () => {
  console.log(socket.id);
  console.log(socket.connected);
});

nutrientData.on("connect_error", (reason) => {
  console.log(reason);
});

nutrientData.on("requestNutrientData", async (data) => {
  console.log("nutriculture 데이터 요청 들어옴");
  const result = await ntctrl.socketIO.nutricultureMachinePageData();
  nutrientData.emit("getNutrientData", result);
});

nutrientData.on("disconnect", (reason) => {
  console.log(reason);
  console.log("disconnect");
});

module.exports = { socket, mainData, nutrientData };
