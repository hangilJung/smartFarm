const SensorData = require("../models/sensordata");

const load = {
  loadLatelySensorData: async (req, res) => {
    const sensorData = new SensorData();
    const result = await sensorData.loadLatelySensorData();
    res.json(result);
  },
  minutes: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.loadMinutesSensorData();
    res.json(result);
  },
  hours: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.loadHoursSensorData();
    res.json(result);
  },
  weeks: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.loadDaysSensorData();
    res.json(result);
  },
  days: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.loadDaysSensorData();
    res.json(result);
  },
  months: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.loadMonthsSensorData();
    res.json(result);
  },
  years: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.loadYearsSensorData();
    res.json(result);
  },
};

module.exports = { load };
