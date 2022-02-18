const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

router.post("/save-sensor-data", ctrl.process.saveSensorData);
router.post("/load-sensor-data", ctrl.process.loadSensorData);
router.post("/emergency", ctrl.process.emergency);
router.post("/login", ctrl.process.login);
router.post("/load-actuator-record", ctrl.process.loadActuatorRecord);
router.post("/operate-actuator", ctrl.process.operateActuator);

module.exports = router;
