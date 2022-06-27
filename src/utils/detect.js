const nt = require("../controllers/nutrient");
const schedule = require("node-schedule");
const DataAccess = require("../models/DataAccess");
const logger = require("../config/logger");

module.exports = () => {
  setInterval(() => {
    nt.socketIO.detectNutrientData();
    console.log("nutrient detect");
  }, 5 * 1000);
  nt.socketIO.detectNutrientData();
  console.log("detecting");

  schedule.scheduleJob("10 00 * * * *", async () => {
    DataAccess.writeHourConsumptionData();
    console.log("소비전력 스케줄 실행");
    logger.info("소비전력 시간 단위 저장 실행");
  });
  schedule.scheduleJob("05 00 * * * *", async () => {
    DataAccess.saveHourSensorData();
    console.log("환경 스케줄 실행");
    logger.info("환경 센서 시간단위 저장 실행");
  });
  schedule.scheduleJob("57 59 * * * *", async () => {
    DataAccess.saveHourRainFallData();
    console.log("강우량 스케줄 실행");
    logger.info("강루량 센서 시간단위 저장 실행");
  });
};
