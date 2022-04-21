module.exports = () => {
  const SensorData = require("../models/sensordata");
  const io = require("./io");

  io.socket.on("showMeTheData", async (data) => {
    const sensorData = new SensorData();
    const response = await sensorData.loadLatelySensorData();
    io.socket.emit("sensorData", response);
  });
};
