const nt = require("../controllers/nutrient");
const schedule = require("node-schedule");
const DataAccess = require("../models/DataAccess");
const logger = require("../config/logger");

module.exports = () => {
  // setInterval(() => {
  //   nt.socketIO.detectNutrientData();
  //   console.log("nutrient detect");
  // }, 10 * 1000);
  // nt.socketIO.detectNutrientData();
  // console.log("detecting");

  schedule.scheduleJob("10 00 * * * *", async () => {
    DataAccess.writeHourConsumptionData();
    console.log("스케줄 실행");
    logger.info("소비전력 시간 단위 저장 실행");
  });
};
