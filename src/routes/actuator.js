const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const nt = require("../controllers/nutrient");
const { ipAndUrl } = require("../lib/middleware");

router.post("/simple", ipAndUrl, ctrl.process.operateSimpleActuator);
router.post("/nutrient", ipAndUrl, ctrl.process.operateNutrientSupply);
router.post("/nutrient-stop", ipAndUrl, ctrl.process.operateNutrientStop);
router.post("/read-nutrient", ipAndUrl, ctrl.process.readNutrient);
router.post("/load-nutrient-data", ipAndUrl, ctrl.process.loadNutrientData);

//1회관수 or 관수정지
router.post("/start", ipAndUrl, nt.nutrient.start);
router.post("/stop", ipAndUrl, nt.nutrient.stop);
router.post(
  "/nutriculture-machine-status",
  ipAndUrl,
  nt.nutrient.nutricultureMachineStatus
);

//간편 or 상세 선택
router.post("/control-mode-easy", nt.nutrient.easySelection);
router.post("/control-mode-detail", nt.nutrient.detailSelection);

//간편 설정 목록(시작시간, 반복 시간 등등)
router.post("/easy-setting", nt.nutrient.easySetting);

//상세 설정
router.post("/detail-setting-time", nt.nutrient.detailSettingTime);
router.post("/detail-setting-matter", nt.nutrient.detailSettingMatter);
router.post("/detail-setting-is-use", nt.nutrient.detailSettingIsUse);
router.post("/detail-setting-tray-is-use", nt.nutrient.detailSettingTrayIsUse);

module.exports = router;
