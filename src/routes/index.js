const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const { verifyToken } = require("../lib/middleware");
const loadSensorData = require("./loadSensorData");
const actuator = require("./actuator");

router.use("/load-sensor-data", loadSensorData);
router.use("/operate-actuator", actuator);

router.post("/save-sensor-data", ctrl.process.saveSensorData);
router.post("/emergency", ctrl.process.emergency);
router.post("/login", ctrl.process.login);
router.post("/load-actuator-record", ctrl.process.loadActuatorRecord);

router.post("/token-v1", ctrl.process.tokenV1);

//test
router.post("/load-sensor-data-all", ctrl.test.loadSensorDataAll);

router.post("/test", (req, res) => {
  res.json("TEST");
});

module.exports = router;
