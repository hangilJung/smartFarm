const { io } = require("socket.io-client");

const socket = io(process.env.SOCKETIO_SERVER_HOST, {
  transports: ["websocket"],
  auth: {
    account: "abcd", // 계정의 아이디를 넣을 예정
  },
});

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log(socket.id);
});

module.exports = socket;
