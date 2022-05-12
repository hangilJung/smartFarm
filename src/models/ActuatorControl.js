const axios = require("axios");
const DataAccess = require("./DataAccess");
const moment = require("moment");
const actu = require("../utils/actuator");
const headerStatusCode = require("../utils/headerStatusCode.js");
const fn = require("../lib/fn");

class ActuatorControl {
  constructor(body) {
    this.body = body;
  }
  // String deviceName   fan1, fan2, fan3
  // String active   on, stop, open, close
  async simpleActuatorControl() {
    const { deviceName, active } = this.body;

    const device = actu.deviceList[deviceName];

    const ctrl = {
      farmlandId: 1,
      data: [
        {
          bedId: 5,
          device,
          active,
          device_name: deviceName,
          dev_data: [],
          datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
        },
      ],
    };

    console.log(ctrl);

    if (fn.parameterIsUndefinded(actu.activeList[active])) {
      return fn.invalidRequestParameterError();
    }

    try {
      const content = fn.createCharacter(deviceName, active);
      console.log(content);
      DataAccess.actuatorControlActionRecord(deviceName, content);
      // const result = await axios.post(process.env.GATEWAY_SERVER, ctl);

      return fn.normalService();
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  // String matter  water, fertilizer
  // Number line    1,2,3,4

  async nutrientSupply() {
    const { matter, line } = this.body;
    const response = {
      header: {},
    };
    const nowTime = moment().format("YYYY-MM-DD T HH:mm:ss");

    if (
      fn.isNutrientSupplyFnParamsAValid(matter, line) ||
      fn.isUndefinedParams(matter, line)
    ) {
      return fn.invalidRequestParameterError();
    }

    const ctl = {
      farmlandId: 1,
      data: [
        {
          bedId: 5,
          device: "nuctrl",
          active: "nuctrl_write",
          deviceName: "nutrient",
          dev_data: fn.whereToSupply(matter, line),
          datetime: nowTime,
        },
      ],
    };

    try {
      const content = fn.writeNutrientSupplyContent(matter, line);

      const result = await axios.post(process.env.GATEWAY_SERVER, ctl);
      DataAccess.actuatorControlActionRecord(ctl.deviceName, content);
      DataAccess.nutrientStartSupplyDatetime(matter, line, nowTime);

      console.log(result);

      if (result.header.resultCode === "00") {
        response.header = headerStatusCode.normalService;
      } else {
        response.header = headerStatusCode.invalidRequestParameterError;
      }

      return response;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async nutrientStop() {
    const dataFormat = fn.deliverDataFormatWrite(actu);
    const nowTime = moment().format("YYYY-MM-DD T HH:mm:ss");
    let latelyTotalSupply;
    let line;
    let data;

    try {
      const content = fn.writeNutrientStopContent();

      const result = await axios.post(process.env.GATEWAY_SERVER, dataFormat);
      DataAccess.actuatorControlActionRecord(
        dataFormat.data[0]["deviceName"],
        content
      );
      const nutrientLineSupplyResult = await DataAccess.nutrientLineSupply();

      for (let i of nutrientLineSupplyResult[0]) {
        if (i["total_supply"] !== null) {
          latelyTotalSupply = i["total_supply"];
          line = i["line"];
        }
      }

      // const getDataNutrientTotalSupplyResult = await axios.post(
      //   process.env.GATEWAY_SERVER,
      //   fn.whatLine(line)
      // );

      // const todaySupply = Number(
      //   getDataNutrientTotalSupplyResult.data[0].dev_data[0]["description"]
      // );

      // const supply = todaySupply - latelyTotalSupply;
      // console.log(supply);

      // await DataAccess.nutrientEndSupplyDatetime(supply, todaySupply, nowTime);
      // const readNutrientSupplyResult = await DataAccess.readNutrientSupply();

      // const startSupplyDatetime = moment(
      //   readNutrientSupplyResult[0][0]["start_supply_date_time"]
      // );
      // const endSupplyDatetime = moment(
      //   readNutrientSupplyResult[0][0]["end_supply_date_time"]
      // );

      // const matter = readNutrientSupplyResult[0][0]["matter"];

      // if (startSupplyDatetime.format("HH") === endSupplyDatetime.format("HH")) {
      //   data = [
      //     {
      //       matter: matter,
      //       line: line,
      //       supply_date_time: nowTime,
      //       supply: supply,
      //     },
      //   ];
      // } else {
      //   const minutePerLitter =
      //     supply /
      //     endSupplyDatetime.diff(moment(startSupplyDatetime), "minutes");

      //   data = fn.twoHourData(
      //     matter,
      //     line,
      //     startSupplyDatetime,
      //     endSupplyDatetime,
      //     minutePerLitter
      //   );
      // }

      // DataAccess.hourlyLineSupply(data);
      return fn.normalService();
    } catch (error) {
      return fn.invalidRequestParameterError();
    }
  }

  async readNutrient() {
    const { wantData } = this.body;

    const dataFormat = fn.deliverDataFormatRead(wantData);
    try {
      // const result = await axios.post(process.env.GATEWAY_SERVER, dataFormat);

      return result;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async emergency() {
    this.nutrientStop();

    const response = {
      header: {},
    };
    const ctrl = actu.emergency;

    try {
      const content = fn.emergencyContent();

      DataAccess.actuatorControlActionRecord(ctrl.deviceName, content);
      DataAccess.actuatorStatusZero();

      // const result = await axios.post(proccess.env.GATEWAY_SERVER, ctl);

      // if (result.header.resultCode === "00") {
      response.header = headerStatusCode.normalService;
      // } else {
      // response.header = headerStatusCode.invalidRequestParameterError;
      // }

      return response;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async loadActuatorRecord() {
    const response = {
      header: {},
    };
    try {
      const result = await DataAccess.loadActionRecord();

      if (result[0].length > 0) {
        response.header = headerStatusCode.normalService;
        response.body = result[0];
      } else {
        response.header = headerStatusCode.invalidRequestParameterError;
      }

      return response;
    } catch (error) {
      return fn.invalidRequestParameterError();
    }
  }

  async loadNutrientData() {
    let response;

    const ctl = {
      farmlandId: 1,
      data: [
        {
          bedId: 5,
          device: "nuctrl",
          active: "nuctrl_read",
          deviceName: "nutrient",
          dev_data: actu.readNutrientDataDigitalAndAnalog.list,
          datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
        },
      ],
    };
    try {
      const result = await axios.post(process.env.GATEWAY_SERVER, ctl);
      console.log(result);
      // if (result.data.header.resultCode === "00") {
      //   response = fn.responseHeaderAndBody(result.data.body);
      // } else {
      //   response = fn.invalidRequestParameterError();
      // }

      return JSON.parse(result);
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async start() {
    try {
      const ctrl = {
        farmlandId: 1,
        data: [
          {
            bedId: 5,
            device: "nuctrl",
            active: "nuctrl_write",
            deviceName: "nutrient",
            dev_data: [
              { modbus_address: "560", description: "1", property: "write" },
            ],
            datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
          },
        ],
      };
      const result = await axios.post(process.env.GATEWAY_SERVER, ctrl);

      return result.data;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async stop() {
    try {
      const ctrl = {
        farmlandId: 1,
        data: [
          {
            bedId: 5,
            device: "nuctrl",
            active: "nuctrl_write",
            deviceName: "nutrient",
            dev_data: [
              { modbus_address: "561", description: "1", property: "write" },
            ],
            datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
          },
        ],
      };
      const result = await axios.post(process.env.GATEWAY_SERVER, ctrl);

      return result.data;
    } catch (error) {
      console.log(error);
      return fn.invalidRequestParameterError();
    }
  }

  async test() {
    try {
      const result = await DataAccess.readNutrientSupply();

      console.log(result[0]);

      const startSupplyDatetime = moment(result[0][0].start_supply_date_time);
      const endSupplyDatetime = moment(result[0][0].end_supply_date_time);

      console.log(startSupplyDatetime, endSupplyDatetime);

      if (startSupplyDatetime.format("HH") === endSupplyDatetime.format("HH")) {
        console.log("시간은 ", startSupplyDatetime.format("HH"));
        console.log(
          "분은 ",
          endSupplyDatetime.diff(startSupplyDatetime, "minutes")
        );

        console.log(
          "12312312",
          endSupplyDatetime.diff(moment(startSupplyDatetime), "minutes")
        );
      } else {
        console.log(
          moment(endSupplyDatetime.format("YYYY-MM-DD HH:00:00")).diff(
            startSupplyDatetime,
            "minutes"
          )
        );
        console.log(
          endSupplyDatetime.diff(
            moment(endSupplyDatetime.format("YYYY-MM-DD HH:00:00")),
            "minutes"
          )
        );
      }

      return result[0];
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ActuatorControl;
