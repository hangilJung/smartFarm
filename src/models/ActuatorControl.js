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

    const response = {
      header: {},
    };
    const device = actu.deviceList.deviceName;

    const ctl = {
      bedId: 5,
      device: device,
      active,
      deviceName,
      dev_data: [],
      datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
    };

    if (fn.parameterIsUndefinded(actu.activeList[active])) {
      response.header = headerStatusCode.invalidRequestParameterError;
      return response;
    }

    try {
      const content = fn.createCharacter(deviceName, active);

      DataAccess.actuatorControlActionRecord(deviceName, content);
      // const result = await axios.post(process.env.GATEWAY_SERVER, ctl);

      response.header = headerStatusCode.normalService;

      return response;
    } catch (error) {
      response.header = headerStatusCode.invalidRequestParameterError;

      return response;
    }
  }

  // String matter  water, fertilizer
  // Number line    1,2,3,4

  async nutrientSupply() {
    const { matter, line } = this.body;
    const response = {
      header: {},
    };

    if (
      fn.isNutrientSupplyFnParamsAValid(matter, line) ||
      fn.isUndefinedParams(matter, line)
    ) {
      response.header = headerStatusCode.invalidRequestParameterError;

      return response;
    }

    const ctl = {
      bedId: 5,
      device: "nuctrl",
      active: "nctrl_write",
      deviceName: "nutrient",
      dev_data: fn.whereToSupply(matter, line),
      datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
    };

    try {
      const content = fn.writeNutrientSupplyContent(matter, line);

      DataAccess.actuatorControlActionRecord(ctl.deviceName, content);
      // const result = await axios.post(process.env.GATEWAY_SERVER, ctl);

      // if (result.header.resultCode === "00") {
      response.header = headerStatusCode.normalService;
      // } else {
      // response.header = headerStatusCode.invalidRequestParameterError;
      // }

      return response;
    } catch (error) {
      response.header = headerStatusCode.invalidRequestParameterError;

      return response;
    }
  }

  async nutrientStop() {
    const response = {
      header: {},
    };
    const ctl = {
      bedId: 5,
      device: "nuctrl",
      active: "nctrl_write",
      deviceName: "nutrient",
      dev_data: fn.stopNutrientCommand(actu),
      datetime: moment().format("YYYY-MM-DD T HH:mm:ss"),
    };

    try {
      const content = fn.writeNutrientStopContent();

      DataAccess.actuatorControlActionRecord(ctl.deviceName, content);
      // const result = await axios.post(process.env.GATEWAY_SERVER, ctl);

      response.header = headerStatusCode.normalService;

      return response;
    } catch (error) {
      response.header = headerStatusCode.invalidRequestParameterError;

      return response;
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
      response.header = headerStatusCode.invalidRequestParameterError;

      return response;
    }
  }

  async loadActuatorRecord() {
    const response = {
      header: {},
    };

    try {
      const result = await DataAccess.loadActionRecord();

      response.header = headerStatusCode.normalService;
      response.body = result[0];

      return response;
    } catch (error) {
      response.header = headerStatusCode.invalidRequestParameterError;

      return response;
    }
  }
}

module.exports = ActuatorControl;
