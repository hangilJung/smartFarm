const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const { verifyToken } = require("../lib/medlleware");

router.post("/save-sensor-data", ctrl.process.saveSensorData);
router.post("/load-sensor-data", ctrl.process.loadLatelySensorData);
router.post("/emergency", ctrl.process.emergency);
router.post("/login", ctrl.process.login);
router.post("/load-actuator-record", ctrl.process.loadActuatorRecord);
router.post("/operate-actuator", ctrl.process.operateActuator);
router.post("/token-v1", ctrl.process.tokenV1);

//test
router.post("/load-sensor-data-all", ctrl.test.loadSensorDataAll);

module.exports = router;
