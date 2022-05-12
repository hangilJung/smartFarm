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
};

module.exports = { nutrient };
