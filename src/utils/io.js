const { io } = require("socket.io-client");
const url = require("../config/url");
const SensorData = require("../models/sensordata");

const socket = io(url.SOCKETIO_SERVER_HOST, {
  transports: ["websocket"],
  auth: {
    account: process.env.SOCKETIO_SECRET_KEY,
    user: "local", // 계정의 아이디를 넣을 예정
  },
});

socket.on("connect", () => {
  console.log(socket.id);
  socket.emit("test", "test");
});

socket.on("test", (data) => {
  console.log(data);
});

socket.on("showMeTheData", async (data) => {
  const sensorData = new SensorData();
  const response = await sensorData.loadSensorData();

  socket.emit("sensorData", response);
});

socket.on("disconnect", () => {
  console.log(socket.id);
});
