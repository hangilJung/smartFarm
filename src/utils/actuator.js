const moment = require("moment");
const time = moment().format("YYYY-MM-DD T HH:mm:ss");

const deviceList = {
  fan1: "fan",
  fan2: "fan",
  fna3: "fan",
  shutter1: "shutter",
  shutter2: "shutter",
  shutter3: "shutter",
  shutter4: "shutter",
  shutter5: "shutter",
  shutter6: "shutter",
  shutter7: "shutter",
  nutrient: "nutrient",
};

const emergency = [
  {
    bedId: 5,
    device: "fan",
    active: "stop",
    deviceName: "fan1",
    dev_data: [],
    datetime: time,
  },
  {
    bedId: 5,
    device: "fan",
    active: "stop",
    deviceName: "fan2",
    dev_data: [],
    datetime: time,
  },
  {
    bedId: 5,
    device: "fan",
    active: "stop",
    deviceName: "fan3",
    dev_data: [],
    datetime: time,
  },
  {
    bedId: 5,
    device: "shutter",
    active: "stop",
    deviceName: "shutter1",
    dev_data: [],
    datetime: time,
  },
  {
    bedId: 5,
    device: "shutter",
    active: "stop",
    deviceName: "shutter2",
    dev_data: [],
    datetime: time,
  },
  {
    bedId: 5,
    device: "shutter",
    active: "stop",
    deviceName: "shutter3",
    dev_data: [],
    datetime: time,
  },
  {
    bedId: 5,
    device: "shutter",
    active: "stop",
    deviceName: "shutter4",
    dev_data: [],
    datetime: time,
  },
  {
    bedId: 5,
    device: "shutter",
    active: "stop",
    deviceName: "shutter5",
    dev_data: [],
    datetime: time,
  },
  {
    bedId: 5,
    device: "shutter",
    active: "stop",
    deviceName: "shutter6",
    dev_data: [],
    datetime: time,
  },
  {
    bedId: 5,
    device: "shutter",
    active: "stop",
    deviceName: "shutter7",
    dev_data: [],
    datetime: time,
  },
];

const activeList = {
  open: "open",
  close: "close",
  on: "on",
  stop: "stop",
};

const nutrient = {
  waterOrFertilizer: {
    setWaterDetail_1: {
      modbus_address: "00016",
      description: "0",
      property: "write",
    },

    setFertilizerDetail_2: {
      modbus_address: "00017",
      description: "1",
      property: "write",
    },
  },
  use: {
    useDetail_1: {
      modbus_address: "00048",
      description: "1",
      property: "write",
    },

    useDetail_2: {
      modbus_address: "00049",
      description: "1",
      property: "write",
    },
  },
  notUse: {
    notUseDetail_1: {
      modbus_address: "00048",
      description: "0",
      property: "write",
    },
    notUseDetail_2: {
      modbus_address: "00049",
      description: "0",
      property: "write",
    },
  },
  useLine: {
    line_1: { modbus_address: "00160", description: "1", property: "write" },
    line_2: { modbus_address: "00161", description: "1", property: "write" },
    line_3: { modbus_address: "00162", description: "1", property: "write" },
    line_4: { modbus_address: "00163", description: "1", property: "write" },
  },

  notUseLine: {
    line_1: { modbus_address: "00160", description: "0", property: "write" },
    line_2: { modbus_address: "00161", description: "0", property: "write" },
    line_3: { modbus_address: "00162", description: "0", property: "write" },
    line_4: { modbus_address: "00163", description: "0", property: "write" },
  },
  act: {
    run: { modbus_address: "00560", description: "1", property: "write" },
    stop: { modbus_address: "00561", description: "1", property: "write" },
  },

  state: {
    lackWater: { modbus_address: "10080", description: "", property: "read" },
    running: { modbus_address: "10081", description: "", property: "read" },
    mainPump: { modbus_address: "10082", description: "", property: "read" },
    pump: { modbus_address: "10083", description: "", property: "read" },
    run: { modbus_address: "10096", description: "", property: "read" },
    stop: { modbus_address: "10100", description: "", property: "read" },
  },
};

module.exports = { deviceList, nutrient, activeList, emergency };
