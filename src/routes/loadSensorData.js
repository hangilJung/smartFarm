const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/loadSensorData");
const { ipAndUrl } = require("../lib/middleware");

router.post("/", ipAndUrl, ctrl.load.loadLatelySensorData);
router.post("/minutes", ipAndUrl, ctrl.load.minutes);
router.post("/hours", ipAndUrl, ctrl.load.hours);
router.post("/main-inside", ipAndUrl, ctrl.load.mainInsideSensorData);
router.post("/main-outside", ipAndUrl, ctrl.load.mainOutsideSensorData);
router.post("/bed-data", ipAndUrl, ctrl.load.bedData);
router.post("/hour-consum", ipAndUrl, ctrl.load.hourConsumptionData);
router.post("/day-consum", ipAndUrl, ctrl.load.dayConsumptionData);
router.post("/month-consum", ipAndUrl, ctrl.load.monthConsumptionData);
router.post("/day-max-value", ipAndUrl, ctrl.load.dayMaxValue);
router.post("/year-consum", ipAndUrl, ctrl.load.yearConsumptionData);
router.post("/accum-consum", ipAndUrl, ctrl.load.accumulateConsumptionData);
router.post(
  "/statistics-consum",
  ipAndUrl,
  ctrl.load.statisticsConsumptionData
);
router.post("/minutely", ipAndUrl, ctrl.load.sensorDataMinutely);
router.post("/hourly", ipAndUrl, ctrl.load.sensorDataHourly);
router.post("/daily", ipAndUrl, ctrl.load.sensorDataDaily);
router.post("/monthly", ipAndUrl, ctrl.load.sensorDataMonthly);
router.post("/yearly", ipAndUrl, ctrl.load.sensorDataYearly);

module.exports = router;
