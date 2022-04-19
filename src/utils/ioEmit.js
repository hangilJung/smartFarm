module.exports = () => {
  const SensorData = require("../models/sensordata");
  const socket = require("./io");

  socket.on("showMeTheData", async (data) => {
    const sensorData = new SensorData();
    const response = await sensorData.loadLatelySensorData();
    socket.emit("sensorData", response);
  });
};
