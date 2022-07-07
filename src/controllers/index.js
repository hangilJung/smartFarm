const Login = require("../models/Login");
const SensorData = require("../models/Sensordata");
const Token = require("../models/Token");
const ActuatorControl = require("../models/ActuatorControl");

const process = {
  saveSensorData: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.saveSensorData();
    res.json(result);
  },
  login: async (req, res) => {
    console.log(req.body);
    const login = new Login(req.body);
    const result = await login.login();
    res.json(result);
  },
  loadActuatorRecord: async (req, res) => {
    const actuatorControl = new ActuatorControl();
    const result = await actuatorControl.loadActuatorRecord();
    res.json(result);
  },
  operateSimpleActuator: async (req, res) => {
    const actuatorControl = new ActuatorControl(req.body);
    const result = await actuatorControl.simpleActuatorControl();
    res.json(result);
  },
  operateNutrientStop: async (req, res) => {
    const actuatorControl = new ActuatorControl();
    const result = await actuatorControl.nutrientStop();
    res.json(result);
  },
  readNutrient: async (req, res) => {
    const actuatorControl = new ActuatorControl(req.body);
    const result = await actuatorControl.readNutrient();
    res.json(result);
  },
  loadNutrientData: async (req, res) => {
    const actuatorControl = new ActuatorControl();
    const result = await actuatorControl.loadNutrientData();
    res.json(result);
  },
  tokenV1: (req, res) => {
    const token = new Token(req.headers.authorization);
    const result = token.tokenIssue();
    res.json(result);
  },
  updateSensorSettingValue: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.updateSensorSettingValue();
    res.json(result);
  },
};

const socketIO = {};

const test = {
  loadSensorDataAll: async (req, res) => {
    const sensorData = new SensorData();
    const result = await sensorData.loadSensorDataAll();
    res.json(result);
  },
  test: async () => {
    const sensorData = new SensorData();
    const result = await sensorData.detectSensorData();
    return result;
  },
};

module.exports = {
  process,
  test,
  socketIO,
};
