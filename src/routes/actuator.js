const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const { ipAndUrl } = require("../lib/middleware");

router.post("/simple", ipAndUrl, ctrl.process.operateSimpleActuator);
router.post("/nutrient", ipAndUrl, ctrl.process.operateNutrientSupply);
router.post("/nutrient-stop", ipAndUrl, ctrl.process.operateNutrientStop);
router.post("/read-nutrient", ipAndUrl, ctrl.process.readNutrient);
router.post("/load-nutrient-data", ipAndUrl, ctrl.process.loadNutrientData);

module.exports = router;
