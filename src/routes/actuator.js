const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

router.post("/simple", ctrl.process.operateSimpleActuator);
router.post("/nutrient", ctrl.process.operateNutrientSupply);
router.post("/nutrient-stop", ctrl.process.operateNutrientStop);

module.exports = router;
