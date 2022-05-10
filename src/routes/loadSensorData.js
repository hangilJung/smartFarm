const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/loadSensorData");
const { ipAndUrl } = require("../lib/middleware");

router.post("/", ipAndUrl, ctrl.load.loadLatelySensorData);
router.post("/minutes", ipAndUrl, ctrl.load.minutes);
router.post("/hours", ipAndUrl, ctrl.load.hours);
router.post("/days", ipAndUrl, ctrl.load.days);
router.post("/months", ipAndUrl, ctrl.load.months);
router.post("/years", ipAndUrl, ctrl.load.years);
router.post("/main-inside", ipAndUrl, ctrl.load.mainInsideSensorData);
router.post("/main-outside", ipAndUrl, ctrl.load.mainOutsideSensorData);
router.post("/bed-data", ipAndUrl, ctrl.load.bedData);

module.exports = router;
