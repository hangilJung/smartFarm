const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const nt = require("../controllers/nutrient");
const { ipAndUrl } = require("../lib/middleware");

router.post("/simple", ipAndUrl, ctrl.process.operateSimpleActuator);
router.post("/nutrient-stop", ipAndUrl, ctrl.process.operateNutrientStop);
router.post("/read-nutrient", ipAndUrl, ctrl.process.readNutrient);
router.post("/load-nutrient-data", ipAndUrl, ctrl.process.loadNutrientData);
router.post("/irrigation", ipAndUrl, nt.nutrient.irrigation);
router.post(
  "/nutriculture-machine-status",
  ipAndUrl,
  nt.nutrient.nutricultureMachineStatus
);
router.post("/control-mode", nt.nutrient.controlMode);
router.post("/easy-setting", nt.nutrient.easySetting);
router.post("/detail-setting-time", nt.nutrient.detailSettingTime);
router.post("/detail-setting-matter", nt.nutrient.detailSettingMatter);
router.post("/detail-setting-is-use", nt.nutrient.detailSettingIsUse);
router.post("/detail-setting-tray-is-use", nt.nutrient.detailSettingTrayIsUse);

module.exports = router;
