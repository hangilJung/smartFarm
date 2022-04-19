const { io } = require("socket.io-client");
const url = require("../config/url");
const accessToken = require("./accessToken.json");
const { reissuanceToken } = require("../lib/fn");

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

module.exports = socket;
