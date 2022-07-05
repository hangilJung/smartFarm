const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const nt = require("../controllers/nutrient");
const { ipAndUrl } = require("../lib/middleware");

router.post("/simple", ipAndUrl, ctrl.process.operateSimpleActuator);
router.post("/nutrient-stop", ipAndUrl, ctrl.process.operateNutrientStop);
router.post("/read-nutrient", ipAndUrl, ctrl.process.readNutrient);
router.post("/load-nutrient-data", ipAndUrl, ctrl.process.loadNutrientData);
router.post("/start", ipAndUrl, nt.nutrient.start);
router.post("/stop", ipAndUrl, nt.nutrient.stop);
router.post(
  "/nutriculture-machine-status",
  ipAndUrl,
  nt.nutrient.databaseNutriculureMachineStatus
);
router.post("/control-mode-easy", nt.nutrient.easySelection);
router.post("/control-mode-detail", nt.nutrient.detailSelection);
router.post("/easy-setting", nt.nutrient.easySetting);
router.post("/detail-setting", nt.nutrient.detailSetting);

router.post("/detail-setting-time", nt.nutrient.detailSettingTime);
router.post("/detail-setting-matter", nt.nutrient.detailSettingMatter);
router.post("/detail-setting-is-use", nt.nutrient.detailSettingIsUse);
router.post("/detail-setting-tray-is-use", nt.nutrient.detailSettingTrayIsUse);
router.post("/detail-supply-setting", nt.nutrient.detailSupplySetting);
router.post("/ec-ph-setting", nt.nutrient.ecPhSetting);

module.exports = router;
