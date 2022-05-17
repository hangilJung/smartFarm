const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const { verifyToken } = require("../lib/middleware");
const loadSensorData = require("./loadSensorData");
const actuator = require("./actuator");
const { ipAndUrl } = require("../lib/middleware");

router.use("/load-sensor-data", verifyToken, loadSensorData);
router.use("/operate-actuator", actuator);

router.post("/save-sensor-data", ctrl.process.saveSensorData);
router.post("/emergency", ipAndUrl, verifyToken, ctrl.process.emergency);
router.post("/login", ipAndUrl, verifyToken, ctrl.process.login);
router.post(
  "/load-actuator-record",
  ipAndUrl,
  verifyToken,
  ctrl.process.loadActuatorRecord
);
router.post(
  "/update",
  ipAndUrl,
  verifyToken,
  ctrl.process.updateSensorSettingValue
);
router.post("/token-v1", ipAndUrl, verifyToken, ctrl.process.tokenV1);
router.post("/test", ctrl.test.test);

module.exports = router;
