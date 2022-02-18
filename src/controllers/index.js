const Login = require("../models/Login");
const SensorData = require("../models/sensordata");

const process = {
  saveSensorData: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const response = await sensorData.saveSensorData();
    res.json(response);
  },
  loadSensorData: async (req, res) => {
    const sensorData = new SensorData();
    const response = await sensorData.loadSensorData();
    res.json(response);
  },
  login: async (req, res) => {
    const login = new Login(req.body);
    const response = await login.login();
    res.json(response);
  },
  loadActuatorRecord: (req, res) => {
    res.json("hello loadActuatorRecord");
  },
  emergency: (req, res) => {
    res.json("hello emergency");
  },
  operateActuator: (req, res) => {
    res.json("hello operateActuator");
  },
};

module.exports = {
  process,
};
