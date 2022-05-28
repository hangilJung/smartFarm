const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const { verifyToken } = require("../lib/middleware");
const loadSensorData = require("./loadSensorData");
const actuator = require("./actuator");
const { ipAndUrl } = require("../lib/middleware");
//test부분===========================================
const { io } = require("socket.io-client");
console.log("fnNutrient 쪽 ", process.env.SOCKETIO_NUTRICULTURE_MACHINE_PAGE);
const nutricultureMachinePage = io(
  process.env.SOCKETIO_NUTRICULTURE_MACHINE_PAGE,
  {
    transports: ["websocket"],
  }
);

nutricultureMachinePage.on("connect", () => {
  console.log(nutricultureMachinePage.id);
  console.log(nutricultureMachinePage.connected);
});

nutricultureMachinePage.on("connect_error", (reason) => {
  console.log(reason);
});

nutricultureMachinePage.on("disconnect", (reason) => {
  console.log(reason);
  console.log("disconnect");
});
//test부분===========================================

router.use("/load-sensor-data", loadSensorData);
router.use("/operate-actuator", actuator);

router.post("/save-sensor-data", ipAndUrl, ctrl.process.saveSensorData);
router.post("/emergency", ipAndUrl, verifyToken, ctrl.process.emergency);
router.post("/login", ipAndUrl, verifyToken, ctrl.process.login);
router.post("/load-actuator-record", ipAndUrl, ctrl.process.loadActuatorRecord);
router.post(
  "/update",
  ipAndUrl,
  verifyToken,
  ctrl.process.updateSensorSettingValue
);
router.post("/token-v1", ipAndUrl, verifyToken, ctrl.process.tokenV1);
router.post("/test", (req, res) => {
  nutricultureMachinePage.emit("detailSetting1", "변한 디테일세팅 1번");
  res.json("test 성공");
});

module.exports = router;
