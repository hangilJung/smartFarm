const nt = require("../controllers/nutrient");
const ctl = require("../controllers/loadSensorData");
const schedule = require("node-schedule");
const DataAccess = require("../models/DataAccess");
const logger = require("../config/logger");
const dsd = require("../controllers/index");
const fn = require("../lib/fn");

module.exports = () => {
  setInterval(async () => {
    await nt.socketIO.detectNutrientData();
    console.log("nutrient detect");
  }, 10 * 1000);
  nt.socketIO.detectNutrientData();
  console.log("detecting");

  fn.detectFsWrite("isLoop", true);
  fn.detectFsWrite("fanStatus", "");

  // setInterval(() => {
  //   const isBool = fn.detectStatusFsRead();
  //   if (isBool.isLoop === true) {
  //     ctl.load.actionLogic();
  //     console.log("actionLogi 작동");
  //   }
  // }, 2000);

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
  //테스트로 매 00초 마다 데이터 전송되게 해둠.
  // schedule.scheduleJob("00 * * * * *", async () => {
  //   console.log("test 소켓통신 실행");
  //   ctl.socketIO.consumptionHourData();
  //   ctl.socketIO.consumptionAccumulatedDayData();
  //   ctl.socketIO.bedData();
  //   nt.socketIO.actionRecord();
  // });
  schedule.scheduleJob("02 * * * * *", async () => {
    console.log("센서 데이터 없는거 체크");
    logger.info("센서 데이터 없는거 체크");
    dsd.process.detectSensorData();
  });
};
