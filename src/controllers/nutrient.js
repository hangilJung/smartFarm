const ActuatorControl = require("../models/ActuatorControl");

const nutrient = {
  start: async (req, res) => {
    const actuatorControl = new ActuatorControl();
    const result = await actuatorControl.start();
    res.json(result);
  },
  stop: async (req, res) => {
    const actuatorControl = new ActuatorControl();
    const result = await actuatorControl.stop();
    res.json(result);
  },
  nutricultureMachineStatus: async (req, res) => {
    const actuatorControl = new ActuatorControl();
    const result = await actuatorControl.nutricultureMachineStatus();
    res.json(result);
  },
  easySelection: async (req, res) => {
    const actuatorControl = new ActuatorControl();
    const result = await actuatorControl.easySelection();
    res.json(result);
  },
  detailSelection: async (req, res) => {
    const actuatorControl = new ActuatorControl();
    const result = await actuatorControl.detailSelection();
    res.json(result);
  },
  easySetting: async (req, res) => {
    const actuatorControl = new ActuatorControl(req.body);
    const result = await actuatorControl.easySetting();
    res.json(result);
  },
  detailSettingTime: async (req, res) => {
    const actuatorControl = new ActuatorControl(req.body);
    const result = await actuatorControl.detailSettingTime();
    res.json(result);
  },
  detailSettingMatter: async (req, res) => {
    const actuatorControl = new ActuatorControl(req.body);
    const result = await actuatorControl.detailSettingMatter();
    res.json(result);
  },
  detailSettingIsUse: async (req, res) => {
    const actuatorControl = new ActuatorControl(req.body);
    const result = await actuatorControl.detailSettingIsUse();
    res.json(result);
  },
  detailSettingTrayIsUse: async (req, res) => {
    const actuatorControl = new ActuatorControl(req.body);
    const result = await actuatorControl.detailSettingTrayIsUse();
    res.json(result);
  },
};
const socketIO = {
  nutricultureMachinePageData: async () => {
    const actuatorControl = new ActuatorControl();
    const result = await actuatorControl.nutricultureMachineStatus();

    if (result == undefined) {
      return "{resultCode: 05, resultMsg: SERVICE_TIME_OUT}";
    } else {
      return result;
    }
  },
  detectNutrientData: async () => {
    const actuatorControl = new ActuatorControl();
    await actuatorControl.sendToFrontNutrienNewtData();
  },
};

module.exports = { nutrient, socketIO };
