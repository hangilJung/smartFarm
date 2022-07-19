const { io } = require("socket.io-client");
const url = require("../config/url");
const { reissuanceToken } = require("../lib/fn");
const ctrl = require("../controllers/loadSensorData");
const ntctrl = require("../controllers/nutrient");

const socket = io(url.SOCKETIO_SERVER_HOST, {
  transports: ["websocket"],
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
  try {
    const result = await ctrl.socketIO.reactFirstMainSensorData();

    mainData.emit("main", result);
  } catch (error) {
    console.log(error);
  }
});

mainData.on("disconnect", (reason) => {
  console.log(reason);
  console.log("disconnect");
});

const nutrient = io(process.env.SOCKETIO_NUTRICULTURE_MACHINE_PAGE, {
  transports: ["websocket"],
});

nutrient.on("connect", () => {
  console.log(socket.id);
  console.log(socket.connected);
});

nutrient.on("connect_error", (reason) => {
  console.log(reason);
});

nutrient.on("requestNutrientData", async (data) => {
  console.log("nutriculture 데이터 요청 들어옴");
  try {
    const result = await ntctrl.socketIO.nutricultureMachinePageData();

    nutrient.emit("getNutrientData", result);
    return;
  } catch (error) {
    console.log(error);
    return;
  }
});

nutrient.on("disconnect", (reason) => {
  console.log(reason);
  console.log("disconnect");
});

module.exports = { socket, mainData, nutrient };
