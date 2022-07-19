const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const { verifyToken } = require("../lib/middleware");
const loadSensorData = require("./loadSensorData");
const actuator = require("./actuator");
const { ipAndUrl } = require("../lib/middleware");

router.use("/load-sensor-data", loadSensorData);
router.use("/operate-actuator", actuator);

router.post("/save-sensor-data", ipAndUrl, ctrl.process.saveSensorData);
router.post("/login", ipAndUrl, verifyToken, ctrl.process.login);
router.post("/load-actuator-record", ipAndUrl, ctrl.process.loadActuatorRecord);
router.post(
  "/update",
  ipAndUrl,
  verifyToken,
  ctrl.process.updateSensorSettingValue
);
router.post("/token-v1", ipAndUrl, verifyToken, ctrl.process.tokenV1);
router.post("/set-action", ipAndUrl, ctrl.process.setAction);
router.post("/read-action", ipAndUrl, ctrl.process.readAction);
router.post("/set-condition", ipAndUrl, ctrl.process.setCondition);
router.post("/get-condition", ipAndUrl, ctrl.process.getCondition);

module.exports = router;
