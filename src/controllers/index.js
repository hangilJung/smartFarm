const Login = require("../models/Login");
const SensorData = require("../models/sensordata");
const Token = require("../models/Token");

const process = {
  saveSensorData: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.saveSensorData();
    res.json(result);
  },
  loadLatelySensorData: async (req, res) => {
    const sensorData = new SensorData();
    const result = await sensorData.loadLatelySensorData();
    res.json(result);
  },
  login: async (req, res) => {
    console.log(req.body);
    const login = new Login(req.body);
    const result = await login.login();
    res.json(result);
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
  tokenV1: (req, res) => {
    const token = new Token(req.headers.authorization);
    const result = token.tokenIssue();
    res.json(result);
  },
};

const test = {
  loadSensorDataAll: async (req, res) => {
    const sensorData = new SensorData();
    const result = await sensorData.loadSensorDataAll();
    res.json(result);
  },
};

module.exports = {
  process,
  test,
};
