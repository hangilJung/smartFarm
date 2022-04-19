const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/loadSensorData");

router.post("/", ctrl.load.loadLatelySensorData);
router.post("/minutes", ctrl.load.minutes);
router.post("/hours", ctrl.load.hours);
router.post("/days", ctrl.load.days);
router.post("/months", ctrl.load.months);
router.post("/years", ctrl.load.years);
router.post("/main", ctrl.load.mainSensorData);

module.exports = router;
