const nt = require("../controllers/nutrient");

module.exports = () => {
  setInterval(() => {
    nt.socketIO.detectNutrientData();
    console.log("nutrient detect");
  }, 7 * 1000);
  // nt.socketIO.detectNutrientData();
  // console.log("detecting");
};
