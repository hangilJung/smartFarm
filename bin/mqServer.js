module.exports = () => {
  const aedes = require("aedes")();
  const mqttBroker = require("net").createServer(aedes.handle);
  const mqttPort = 1883;

  mqttBroker.listen(mqttPort, () => {
    console.log("MQTT broker server listening", mqttPort);
  });
};
