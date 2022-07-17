const SensorData = require("../models/SensorData");

const load = {
  loadLatelySensorData: async (req, res) => {
    const sensorData = new SensorData();
    const result = await sensorData.loadLatelySensorData();
    res.json(result);
  },
  mainInsideSensorData: async (req, res) => {
    const sensorData = new SensorData();
    const result = await sensorData.mainInsideSensorData();
    res.json(result);
  },
  mainOutsideSensorData: async (req, res) => {
    const sensorData = new SensorData();
    const result = await sensorData.mainOutsideSensorData();
    res.json(result);
  },
  main: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.main();
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
  bedData: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.readBedData();
    res.json(result);
  },
  hourConsumptionData: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.hourConsumptionData();
    res.json(result);
  },
  dayConsumptionData: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.dayConsumptionData();
    res.json(result);
  },
  monthConsumptionData: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.monthConsumptionData();
    res.json(result);
  },
  yearConsumptionData: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.yearConsumptionData();
    res.json(result);
  },
  accumulateConsumptionData: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.accumulateConsumptionData();
    res.json(result);
  },
  statisticsConsumptionData: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.statisticsConsumptionData();
    res.json(result);
  },
  sensorDataMinutely: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.sensorDataMinutely();
    res.json(result);
  },
  sensorDataHourly: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.sensorDataHourly();
    res.json(result);
  },
  sensorDataDaily: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.sensorDataDaily();
    res.json(result);
  },
  sensorDataMonthly: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.sensorDataMonthly();
    res.json(result);
  },
  sensorDataYearly: async (req, res) => {
    const sensorData = new SensorData(req.body);
    const result = await sensorData.sensorDataYearly();
    res.json(result);
  },
  actionLogic: async () => {
    const sensorData = new SensorData();
    await sensorData.actionLogic();
  },
};

const socketIO = {
  consumptionHourData: async () => {
    const sensorData = new SensorData();
    await sensorData.socketConsumptionHourData();
  },
  consumptionAccumulatedDayData: async () => {
    const sensorData = new SensorData();
    await sensorData.socketConsumptionAccumulatedDayData();
  },
  bedData: async () => {
    const sensorData = new SensorData();
    await sensorData.socketBedData();
  },
};

module.exports = { load, socketIO };
