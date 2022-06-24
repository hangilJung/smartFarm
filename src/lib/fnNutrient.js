const { io } = require("socket.io-client");

const nutricultureMachinePage = io(
  process.env.SOCKETIO_NUTRICULTURE_MACHINE_PAGE,
  {
    transports: ["websocket"],
  }
);

nutricultureMachinePage.on("connect", () => {
  console.log(nutricultureMachinePage.id);
  console.log(nutricultureMachinePage.connected);
});

nutricultureMachinePage.on("connect_error", (reason) => {
  console.log(reason);
});

nutricultureMachinePage.on("disconnect", (reason) => {
  console.log(reason);
  console.log("disconnect");
});

function detailHourMinute(where, hour, minute) {
  console.log(where, hour, minute);
  const list = {
    detail1: [
      {
        modbus_address: "44200",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44201",
        description: minute,
        property: "write",
      },
    ],
    detail2: [
      {
        modbus_address: "44202",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44203",
        description: minute,
        property: "write",
      },
    ],
    detail3: [
      {
        modbus_address: "44204",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44205",
        description: minute,
        property: "write",
      },
    ],
    detail4: [
      {
        modbus_address: "44206",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44207",
        description: minute,
        property: "write",
      },
    ],
    detail5: [
      {
        modbus_address: "44208",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44209",
        description: minute,
        property: "write",
      },
    ],
    detail6: [
      {
        modbus_address: "44210",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44211",
        description: minute,
        property: "write",
      },
    ],
    detail7: [
      {
        modbus_address: "44212",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44213",
        description: minute,
        property: "write",
      },
    ],
    detail8: [
      {
        modbus_address: "44214",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44215",
        description: minute,
        property: "write",
      },
    ],
    detail9: [
      {
        modbus_address: "44216",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44217",
        description: minute,
        property: "write",
      },
    ],
    detail10: [
      {
        modbus_address: "44218",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44219",
        description: minute,
        property: "write",
      },
    ],
    detail11: [
      {
        modbus_address: "44220",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44221",
        description: minute,
        property: "write",
      },
    ],
    detail12: [
      {
        modbus_address: "44222",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44223",
        description: minute,
        property: "write",
      },
    ],
    detail13: [
      {
        modbus_address: "44224",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44225",
        description: minute,
        property: "write",
      },
    ],
    detail14: [
      {
        modbus_address: "44226",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44227",
        description: minute,
        property: "write",
      },
    ],
    detail15: [
      {
        modbus_address: "44228",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44229",
        description: minute,
        property: "write",
      },
    ],
    detail16: [
      {
        modbus_address: "44230",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44231",
        description: minute,
        property: "write",
      },
    ],
    detail17: [
      {
        modbus_address: "44232",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44233",
        description: minute,
        property: "write",
      },
    ],
    detail18: [
      {
        modbus_address: "44234",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44235",
        description: minute,
        property: "write",
      },
    ],
    detail19: [
      {
        modbus_address: "44236",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44237",
        description: minute,
        property: "write",
      },
    ],
    detail20: [
      {
        modbus_address: "44238",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44239",
        description: minute,
        property: "write",
      },
    ],
    detail21: [
      {
        modbus_address: "44240",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44241",
        description: minute,
        property: "write",
      },
    ],
    detail22: [
      {
        modbus_address: "44242",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44243",
        description: minute,
        property: "write",
      },
    ],
    detail23: [
      {
        modbus_address: "44244",
        description: hour,
        property: "write",
      },
      {
        modbus_address: "44245",
        description: minute,
        property: "write",
      },
    ],
  };

  return list[where];
}

function detailMatter(where, matter) {
  const list = {
    detail1: [{ modbus_address: "16", description: matter, property: "write" }],
    detail2: [{ modbus_address: "17", description: matter, property: "write" }],
    detail3: [{ modbus_address: "18", description: matter, property: "write" }],
    detail4: [{ modbus_address: "19", description: matter, property: "write" }],
    detail5: [{ modbus_address: "20", description: matter, property: "write" }],
    detail6: [{ modbus_address: "21", description: matter, property: "write" }],
    detail7: [{ modbus_address: "22", description: matter, property: "write" }],
    detail8: [{ modbus_address: "23", description: matter, property: "write" }],
    detail9: [{ modbus_address: "24", description: matter, property: "write" }],
    detail10: [
      { modbus_address: "25", description: matter, property: "write" },
    ],
    detail11: [
      { modbus_address: "26", description: matter, property: "write" },
    ],
    detail12: [
      { modbus_address: "27", description: matter, property: "write" },
    ],
    detail13: [
      { modbus_address: "28", description: matter, property: "write" },
    ],
    detail14: [
      { modbus_address: "29", description: matter, property: "write" },
    ],
    detail15: [
      { modbus_address: "30", description: matter, property: "write" },
    ],
    detail16: [
      { modbus_address: "31", description: matter, property: "write" },
    ],
    detail17: [
      { modbus_address: "32", description: matter, property: "write" },
    ],
    detail18: [
      { modbus_address: "33", description: matter, property: "write" },
    ],
    detail19: [
      { modbus_address: "34", description: matter, property: "write" },
    ],
    detail20: [
      { modbus_address: "35", description: matter, property: "write" },
    ],
    detail21: [
      { modbus_address: "36", description: matter, property: "write" },
    ],
    detail22: [
      { modbus_address: "37", description: matter, property: "write" },
    ],
    detail23: [
      { modbus_address: "38", description: matter, property: "write" },
    ],
  };

  return list[where];
}

function easySetting(body) {
  const {
    easyStartHour,
    easyStartMinute,
    easyRepeatHour,
    easyRepeatMinute,
    easyRepeatCycle,
    easyEcSetting,
    easyPhSetting,
    easySupplyTray1Minute,
    easySupplyTray1Second,
    easySupplyTray2Minute,
    easySupplyTray2Second,
    easySupplyTray3Minute,
    easySupplyTray3Second,
    easySupplyTray4Minute,
    easySupplyTray4Second,
  } = body;
  const list = [];
  const par = "";

  if (easyStartHour !== par) {
    list.push({
      modbus_address: "44100",
      description: easyStartHour,
      property: "write",
    });
  }
  if (easyStartMinute !== par) {
    list.push({
      modbus_address: "44101",
      description: easyStartMinute,
      property: "write",
    });
  }
  if (easyRepeatHour !== par) {
    list.push({
      modbus_address: "44102",
      description: easyRepeatHour,
      property: "write",
    });
  }
  if (easyRepeatMinute !== par) {
    list.push({
      modbus_address: "44103",
      description: easyRepeatMinute,
      property: "write",
    });
  }
  if (easyRepeatCycle !== par) {
    list.push({
      modbus_address: "44104",
      description: easyRepeatCycle,
      property: "write",
    });
  }
  if (easyEcSetting !== par) {
    list.push({
      modbus_address: "44105",
      description: String(Number(easyEcSetting * 1000)),
      property: "write",
    });
  }
  if (easyPhSetting !== par) {
    list.push({
      modbus_address: "44106",
      description: String(Number(easyPhSetting) * 1000),
      property: "write",
    });
  }
  if (easySupplyTray1Minute !== par) {
    list.push({
      modbus_address: "44110",
      description: easySupplyTray1Minute,
      property: "write",
    });
  }
  if (easySupplyTray1Second !== par) {
    list.push({
      modbus_address: "44111",
      description: easySupplyTray1Second,
      property: "write",
    });
  }
  if (easySupplyTray2Minute !== par) {
    list.push({
      modbus_address: "44112",
      description: easySupplyTray2Minute,
      property: "write",
    });
  }
  if (easySupplyTray2Second !== par) {
    list.push({
      modbus_address: "44113",
      description: easySupplyTray2Second,
      property: "write",
    });
  }
  if (easySupplyTray3Minute !== par) {
    list.push({
      modbus_address: "44114",
      description: easySupplyTray3Minute,
      property: "write",
    });
  }
  if (easySupplyTray3Second !== par) {
    list.push({
      modbus_address: "44115",
      description: easySupplyTray3Second,
      property: "write",
    });
  }
  if (easySupplyTray4Minute !== par) {
    list.push({
      modbus_address: "44116",
      description: easySupplyTray4Minute,
      property: "write",
    });
  }
  if (easySupplyTray4Second !== par) {
    list.push({
      modbus_address: "44117",
      description: easySupplyTray4Second,
      property: "write",
    });
  }

  return list;
}

function invalidEasySetting(body) {
  const {
    easyStartHour,
    easyStartMinute,
    easyRepeatHour,
    easyRepeatMinute,
    easyRepeatCycle,
    easyEcSetting,
    easyPhSetting,
    easySupplyTray1Minute,
    easySupplyTray1Second,
    easySupplyTray2Minute,
    easySupplyTray2Second,
    easySupplyTray3Minute,
    easySupplyTray3Second,
    easySupplyTray4Minute,
    easySupplyTray4Second,
  } = body;
  console.log(body);

  if (Number(easyStartHour) > 23 || Number(easyStartHour) < 0) {
    return true;
  }
  if (Number(easyStartMinute) > 59 || Number(easyStartMinute) < 0) {
    return true;
  }
  if (Number(easyRepeatHour) > 23 || Number(easyRepeatHour) < 0) {
    return true;
  }
  if (Number(easyRepeatMinute) > 59 || Number(easyRepeatMinute) < 0) {
    return true;
  }
  if (Number(easyRepeatCycle) > 99 || Number(easyRepeatCycle) < 0) {
    return true;
  }
  if (Number(easyEcSetting) * 1000 > 5000 || Number(easyEcSetting) * 1000 < 0) {
    return true;
  }
  if (
    Number(easyPhSetting) * 1000 > 14000 ||
    Number(easyPhSetting) * 1000 < 0
  ) {
    return true;
  }
  if (Number(easySupplyTray1Minute) > 99 || Number(easySupplyTray1Minute) < 0) {
    return true;
  }
  if (Number(easySupplyTray1Second) > 59 || Number(easySupplyTray1Second) < 0) {
    return true;
  }
  if (Number(easySupplyTray2Minute) > 99 || Number(easySupplyTray2Minute) < 0) {
    return true;
  }
  if (Number(easySupplyTray2Second) > 59 || Number(easySupplyTray2Second) < 0) {
    return true;
  }
  if (Number(easySupplyTray3Minute) > 99 || Number(easySupplyTray3Minute) < 0) {
    return true;
  }
  if (Number(easySupplyTray3Second) > 59 || Number(easySupplyTray3Second) < 0) {
    return true;
  }
  if (Number(easySupplyTray4Minute) > 99 || Number(easySupplyTray4Minute) < 0) {
    return true;
  }
  if (Number(easySupplyTray4Second) > 59 || Number(easySupplyTray4Second) < 0) {
    return true;
  }

  return false;
}

function detailIsUse(where, isUse) {
  const list = {
    detail1: [{ modbus_address: "48", description: isUse, property: "write" }],
    detail2: [{ modbus_address: "49", description: isUse, property: "write" }],
    detail3: [{ modbus_address: "50", description: isUse, property: "write" }],
    detail4: [{ modbus_address: "51", description: isUse, property: "write" }],
    detail5: [{ modbus_address: "52", description: isUse, property: "write" }],
    detail6: [{ modbus_address: "53", description: isUse, property: "write" }],
    detail7: [{ modbus_address: "54", description: isUse, property: "write" }],
    detail8: [{ modbus_address: "55", description: isUse, property: "write" }],
    detail9: [{ modbus_address: "56", description: isUse, property: "write" }],
    detail10: [{ modbus_address: "57", description: isUse, property: "write" }],
    detail11: [{ modbus_address: "58", description: isUse, property: "write" }],
    detail12: [{ modbus_address: "59", description: isUse, property: "write" }],
    detail13: [{ modbus_address: "60", description: isUse, property: "write" }],
    detail14: [{ modbus_address: "61", description: isUse, property: "write" }],
    detail15: [{ modbus_address: "62", description: isUse, property: "write" }],
    detail16: [{ modbus_address: "63", description: isUse, property: "write" }],
    detail17: [{ modbus_address: "64", description: isUse, property: "write" }],
    detail18: [{ modbus_address: "65", description: isUse, property: "write" }],
    detail19: [{ modbus_address: "66", description: isUse, property: "write" }],
    detail20: [{ modbus_address: "67", description: isUse, property: "write" }],
    detail21: [{ modbus_address: "68", description: isUse, property: "write" }],
    detail22: [{ modbus_address: "69", description: isUse, property: "write" }],
    detail23: [{ modbus_address: "70", description: isUse, property: "write" }],
  };

  return list[where];
}

function detailTrayIsUse(where, tray, isUse) {
  const list = {
    detail1: {
      tray1: [{ modbus_address: "160", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "161", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "162", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "163", description: isUse, property: "write" }],
    },
    detail2: {
      tray1: [{ modbus_address: "176", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "177", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "178", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "179", description: isUse, property: "write" }],
    },
    detail3: {
      tray1: [{ modbus_address: "192", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "193", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "194", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "195", description: isUse, property: "write" }],
    },
    detail4: {
      tray1: [{ modbus_address: "208", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "209", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "210", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "211", description: isUse, property: "write" }],
    },
    detail5: {
      tray1: [{ modbus_address: "224", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "225", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "226", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "227", description: isUse, property: "write" }],
    },
    detail6: {
      tray1: [{ modbus_address: "240", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "241", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "242", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "243", description: isUse, property: "write" }],
    },
    detail7: {
      tray1: [{ modbus_address: "256", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "257", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "258", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "259", description: isUse, property: "write" }],
    },
    detail8: {
      tray1: [{ modbus_address: "272", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "273", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "274", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "275", description: isUse, property: "write" }],
    },
    detail9: {
      tray1: [{ modbus_address: "288", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "289", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "290", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "291", description: isUse, property: "write" }],
    },
    detail10: {
      tray1: [{ modbus_address: "304", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "305", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "306", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "307", description: isUse, property: "write" }],
    },
    detail11: {
      tray1: [{ modbus_address: "320", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "321", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "322", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "323", description: isUse, property: "write" }],
    },
    detail12: {
      tray1: [{ modbus_address: "336", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "337", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "338", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "339", description: isUse, property: "write" }],
    },
    detail13: {
      tray1: [{ modbus_address: "352", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "353", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "354", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "355", description: isUse, property: "write" }],
    },
    detail14: {
      tray1: [{ modbus_address: "368", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "369", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "370", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "371", description: isUse, property: "write" }],
    },
    detail15: {
      tray1: [{ modbus_address: "384", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "385", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "386", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "387", description: isUse, property: "write" }],
    },
    detail16: {
      tray1: [{ modbus_address: "400", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "401", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "402", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "403", description: isUse, property: "write" }],
    },
    detail17: {
      tray1: [{ modbus_address: "416", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "417", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "418", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "419", description: isUse, property: "write" }],
    },
    detail18: {
      tray1: [{ modbus_address: "432", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "433", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "434", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "435", description: isUse, property: "write" }],
    },
    detail19: {
      tray1: [{ modbus_address: "448", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "449", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "450", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "451", description: isUse, property: "write" }],
    },
    detail20: {
      tray1: [{ modbus_address: "464", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "465", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "466", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "467", description: isUse, property: "write" }],
    },
    detail21: {
      tray1: [{ modbus_address: "480", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "481", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "482", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "483", description: isUse, property: "write" }],
    },
    detail22: {
      tray1: [{ modbus_address: "496", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "497", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "498", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "499", description: isUse, property: "write" }],
    },
    detail23: {
      tray1: [{ modbus_address: "512", description: isUse, property: "write" }],
      tray2: [{ modbus_address: "513", description: isUse, property: "write" }],
      tray3: [{ modbus_address: "514", description: isUse, property: "write" }],
      tray4: [{ modbus_address: "515", description: isUse, property: "write" }],
    },
  };

  return list[where][tray];
}

function nutricultureMachineList() {
  const list = {
    detail1: [
      { modbus_address: "44200", description: isUse, property: "read" },
      { modbus_address: "44201", description: isUse, property: "read" },
      { modbus_address: "16", description: isUse, property: "read" },
      { modbus_address: "48", description: isUse, property: "read" },
      { modbus_address: "160", description: isUse, property: "read" },
      { modbus_address: "161", description: isUse, property: "read" },
      { modbus_address: "162", description: isUse, property: "read" },
      { modbus_address: "163", description: isUse, property: "read" },
    ],
    detail2: [],
  };
}

function whatDetailNumber(data) {
  console.log("whatDetailNumber", data);
  let arr = [];

  let easySetting = true;
  let detail1 = true;
  let detail2 = true;
  let detail3 = true;
  let detail4 = true;
  let detail5 = true;
  let detail6 = true;
  let detail7 = true;
  let detail8 = true;
  let detail9 = true;
  let detail10 = true;
  let detail11 = true;
  let detail12 = true;
  let detail13 = true;
  let detail14 = true;
  let detail15 = true;
  let detail16 = true;
  let detail17 = true;
  let detail18 = true;
  let detail19 = true;
  let detail20 = true;
  let detail21 = true;
  let detail22 = true;
  let detail23 = true;
  let controlMode = true;
  let todaySupply = true;

  for (let list of data) {
    if (
      list["address"] == "44200" ||
      list["address"] == "44201" ||
      list["address"] == "16" ||
      list["address"] == "48" ||
      list["address"] == "160" ||
      list["address"] == "161" ||
      list["address"] == "162" ||
      list["address"] == "163"
    ) {
      console.log("1");
      if (detail1) {
        detail1 = false;
        console.log("담다");
        arr.push("detailSetting1");
      }
    } else if (
      list["address"] == "44202" ||
      list["address"] == "44203" ||
      list["address"] == "17" ||
      list["address"] == "49" ||
      list["address"] == "176" ||
      list["address"] == "177" ||
      list["address"] == "178" ||
      list["address"] == "179"
    ) {
      console.log("2");
      if (detail2) {
        detail2 = false;
        console.log("담다");
        arr.push("detailSetting2");
      }
    } else if (
      list["address"] == "44204" ||
      list["address"] == "44205" ||
      list["address"] == "18" ||
      list["address"] == "50" ||
      list["address"] == "192" ||
      list["address"] == "193" ||
      list["address"] == "194" ||
      list["address"] == "195"
    ) {
      console.log("3");
      if (detail3) {
        detail3 = false;
        console.log("담다");
        arr.push("detailSetting3");
      }
    } else if (
      list["address"] == "44206" ||
      list["address"] == "44207" ||
      list["address"] == "19" ||
      list["address"] == "51" ||
      list["address"] == "208" ||
      list["address"] == "209" ||
      list["address"] == "210" ||
      list["address"] == "211"
    ) {
      console.log("4");
      if (detail4) {
        detail4 = false;
        console.log("담다");
        arr.push("detailSetting4");
      }
    } else if (
      list["address"] == "44208" ||
      list["address"] == "44209" ||
      list["address"] == "20" ||
      list["address"] == "52" ||
      list["address"] == "224" ||
      list["address"] == "225" ||
      list["address"] == "226" ||
      list["address"] == "227"
    ) {
      console.log("5");
      if (detail5) {
        detail5 = false;
        console.log("담다");
        arr.push("detailSetting5");
      }
    } else if (
      list["address"] == "44210" ||
      list["address"] == "44211" ||
      list["address"] == "21" ||
      list["address"] == "53" ||
      list["address"] == "240" ||
      list["address"] == "241" ||
      list["address"] == "242" ||
      list["address"] == "243"
    ) {
      console.log("6");
      if (detail6) {
        detail6 = false;
        console.log("담다");
        arr.push("detailSetting6");
      }
    } else if (
      list["address"] == "44212" ||
      list["address"] == "44213" ||
      list["address"] == "22" ||
      list["address"] == "54" ||
      list["address"] == "256" ||
      list["address"] == "257" ||
      list["address"] == "258" ||
      list["address"] == "259"
    ) {
      console.log("7");
      if (detail7) {
        detail7 = false;
        console.log("담다");
        arr.push("detailSetting7");
      }
    } else if (
      list["address"] == "44214" ||
      list["address"] == "44215" ||
      list["address"] == "23" ||
      list["address"] == "55" ||
      list["address"] == "272" ||
      list["address"] == "273" ||
      list["address"] == "274" ||
      list["address"] == "275"
    ) {
      console.log("8");
      if (detail8) {
        detail8 = false;
        console.log("담다");
        arr.push("detailSetting8");
      }
    } else if (
      list["address"] == "44216" ||
      list["address"] == "44217" ||
      list["address"] == "24" ||
      list["address"] == "56" ||
      list["address"] == "288" ||
      list["address"] == "289" ||
      list["address"] == "290" ||
      list["address"] == "291"
    ) {
      console.log("9");
      if (detail9) {
        detail9 = false;
        console.log("담다");
        arr.push("detailSetting9");
      }
    } else if (
      list["address"] == "44218" ||
      list["address"] == "44219" ||
      list["address"] == "25" ||
      list["address"] == "57" ||
      list["address"] == "304" ||
      list["address"] == "305" ||
      list["address"] == "306" ||
      list["address"] == "307"
    ) {
      console.log("10");
      if (detail10) {
        detail10 = false;
        console.log("담다");
        arr.push("detailSetting10");
      }
    } else if (
      list["address"] == "44220" ||
      list["address"] == "44221" ||
      list["address"] == "26" ||
      list["address"] == "58" ||
      list["address"] == "320" ||
      list["address"] == "321" ||
      list["address"] == "322" ||
      list["address"] == "323"
    ) {
      console.log("11");
      if (detail11) {
        detail11 = false;
        console.log("담다");
        arr.push("detailSetting11");
      }
    } else if (
      list["address"] == "44222" ||
      list["address"] == "44223" ||
      list["address"] == "27" ||
      list["address"] == "59" ||
      list["address"] == "336" ||
      list["address"] == "337" ||
      list["address"] == "338" ||
      list["address"] == "339"
    ) {
      console.log("12");
      if (detail12) {
        detail12 = false;
        console.log("담다");
        arr.push("detailSetting12");
      }
    } else if (
      list["address"] == "44224" ||
      list["address"] == "44225" ||
      list["address"] == "28" ||
      list["address"] == "60" ||
      list["address"] == "352" ||
      list["address"] == "353" ||
      list["address"] == "354" ||
      list["address"] == "355"
    ) {
      console.log("13");
      if (detail13) {
        detail13 = false;
        console.log("담다");
        arr.push("detailSetting13");
      }
    } else if (
      list["address"] == "44226" ||
      list["address"] == "44227" ||
      list["address"] == "29" ||
      list["address"] == "61" ||
      list["address"] == "368" ||
      list["address"] == "369" ||
      list["address"] == "370" ||
      list["address"] == "371"
    ) {
      console.log("14");
      if (detail14) {
        detail14 = false;
        console.log("담다");
        arr.push("detailSetting14");
      }
    } else if (
      list["address"] == "44228" ||
      list["address"] == "44229" ||
      list["address"] == "30" ||
      list["address"] == "62" ||
      list["address"] == "384" ||
      list["address"] == "385" ||
      list["address"] == "386" ||
      list["address"] == "387"
    ) {
      console.log("15");
      if (detail15) {
        detail15 = false;
        console.log("담다");
        arr.push("detailSetting15");
      }
    } else if (
      list["address"] == "44230" ||
      list["address"] == "44231" ||
      list["address"] == "31" ||
      list["address"] == "63" ||
      list["address"] == "400" ||
      list["address"] == "401" ||
      list["address"] == "402" ||
      list["address"] == "403"
    ) {
      console.log("16");
      if (detail16) {
        detail16 = false;
        console.log("담다");
        arr.push("detailSetting16");
      }
    } else if (
      list["address"] == "44232" ||
      list["address"] == "44233" ||
      list["address"] == "32" ||
      list["address"] == "64" ||
      list["address"] == "416" ||
      list["address"] == "417" ||
      list["address"] == "418" ||
      list["address"] == "419"
    ) {
      console.log("17");
      if (detail17) {
        detail17 = false;
        console.log("담다");
        arr.push("detailSetting17");
      }
    } else if (
      list["address"] == "44234" ||
      list["address"] == "44235" ||
      list["address"] == "33" ||
      list["address"] == "65" ||
      list["address"] == "432" ||
      list["address"] == "433" ||
      list["address"] == "434" ||
      list["address"] == "435"
    ) {
      console.log("18");
      if (detail18) {
        detail18 = false;
        console.log("담다");
        arr.push("detailSetting18");
      }
    } else if (
      list["address"] == "44236" ||
      list["address"] == "44237" ||
      list["address"] == "34" ||
      list["address"] == "66" ||
      list["address"] == "448" ||
      list["address"] == "449" ||
      list["address"] == "450" ||
      list["address"] == "451"
    ) {
      console.log("19");
      if (detail19) {
        detail19 = false;
        console.log("담다");
        arr.push("detailSetting19");
      }
    } else if (
      list["address"] == "44238" ||
      list["address"] == "44239" ||
      list["address"] == "35" ||
      list["address"] == "67" ||
      list["address"] == "464" ||
      list["address"] == "465" ||
      list["address"] == "466" ||
      list["address"] == "467"
    ) {
      console.log("20");
      if (detail20) {
        detail20 = false;
        console.log("담다");
        arr.push("detailSetting20");
      }
    } else if (
      list["address"] == "44240" ||
      list["address"] == "44241" ||
      list["address"] == "36" ||
      list["address"] == "68" ||
      list["address"] == "480" ||
      list["address"] == "481" ||
      list["address"] == "482" ||
      list["address"] == "483"
    ) {
      console.log("21");
      if (detail21) {
        detail21 = false;
        console.log("담다");
        arr.push("detailSetting21");
      }
    } else if (
      list["address"] == "44242" ||
      list["address"] == "44243" ||
      list["address"] == "37" ||
      list["address"] == "69" ||
      list["address"] == "496" ||
      list["address"] == "497" ||
      list["address"] == "498" ||
      list["address"] == "499"
    ) {
      console.log("22");
      if (detail22) {
        detail22 = false;
        console.log("담다");
        arr.push("detailSetting22");
      }
    } else if (
      list["address"] == "44244" ||
      list["address"] == "44245" ||
      list["address"] == "38" ||
      list["address"] == "70" ||
      list["address"] == "512" ||
      list["address"] == "513" ||
      list["address"] == "514" ||
      list["address"] == "515"
    ) {
      console.log("23");
      if (detail23) {
        detail23 = false;
        console.log("담다");
        arr.push("detailSetting23");
      }
    } else if (
      list["address"] == "44100" ||
      list["address"] == "44101" ||
      list["address"] == "44102" ||
      list["address"] == "44103" ||
      list["address"] == "44104" ||
      list["address"] == "44105" ||
      list["address"] == "44106" ||
      list["address"] == "44110" ||
      list["address"] == "44111" ||
      list["address"] == "44112" ||
      list["address"] == "44113" ||
      list["address"] == "44114" ||
      list["address"] == "44115" ||
      list["address"] == "44116" ||
      list["address"] == "44117"
    ) {
      console.log("간편설정");
      if (easySetting) {
        easySetting = false;
        console.log("담다");
        arr.push("easySetting");
      }
    } else if (list["address"] == "44400") {
      console.log("컨트롤 모드");
      if (controlMode) {
        console.log("담다");
        arr.push("controlMode");
      }
    } else if (
      list["address"] == "44520" ||
      list["address"] == "44521" ||
      list["address"] == "44522" ||
      list["address"] == "44523" ||
      list["address"] == "44524" ||
      list["address"] == "44525" ||
      list["address"] == "44526" ||
      list["address"] == "44527"
    ) {
      console.log("금일 관수량");
      if (todaySupply) {
        console.log("담다");
        arr.push("todaySupply");
      }
    } else if (list["address"] == "560") {
      console.log("1회 관수");
      if (todaySupply) {
        console.log("담다");
        arr.push("run");
      }
    }
  }

  return arr;
}

function choiceDetailSettingChangeData(nutrientData, addressList) {
  console.log("choiceDetailSettingChangeData쪽 ", addressList);
  let arr = [];
  const response = {
    header: {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
    },
  };
  for (let data of nutrientData) {
    for (let needData of addressList) {
      if (data["address"] == needData) {
        console.log("이것은 needData", needData);
        arr.push(data);
        break;
      }
    }
  }

  response.body = arr;

  return response;
}

function socketEmit(eventName, data) {
  console.log("socket Emit쪽 ", eventName, data);
  nutricultureMachinePage.emit(eventName, data);
}

function sendToNutricultureMachinePageSocket(list, nutrientData) {
  for (let data of list) {
    console.log(data);
    if (data == "controlMode") {
      const controlMode = ["44400"];
      console.log("controlMode");
      socketEmit(
        "controlMode",
        choiceDetailSettingChangeData(nutrientData, controlMode)
      );
    } else if (data == "easySetting") {
      const easySettingAddressList = [
        "44100",
        "44101",
        "44102",
        "44103",
        "44104",
        "44105",
        "44106",
        "44110",
        "44111",
        "44112",
        "44113",
        "44114",
        "44115",
        "44116",
        "44117",
      ];
      console.log("easySetting");
      socketEmit(
        "easySetting",
        choiceDetailSettingChangeData(nutrientData, easySettingAddressList)
      );
    } else if (data == "detailSetting1") {
      const detailSetting1 = [
        "44200",
        "44201",
        "16",
        "48",
        "160",
        "161",
        "162",
        "163",
      ];
      socketEmit(
        "detailSetting1",
        choiceDetailSettingChangeData(nutrientData, detailSetting1)
      );
    } else if (data == "detailSetting2") {
      const detailSetting2 = [
        "44202",
        "44203",
        "17",
        "49",
        "176",
        "177",
        "178",
        "179",
      ];

      socketEmit(
        "detailSetting2",
        choiceDetailSettingChangeData(nutrientData, detailSetting2)
      );
    } else if (data == "detailSetting3") {
      const detailSetting3 = [
        "44204",
        "44205",
        "17",
        "50",
        "192",
        "193",
        "194",
        "195",
      ];

      socketEmit(
        "detailSetting3",
        choiceDetailSettingChangeData(nutrientData, detailSetting3)
      );
    } else if (data == "detailSetting4") {
      const detailSetting4 = [
        "44206",
        "44207",
        "19",
        "51",
        "208",
        "209",
        "210",
        "211",
      ];

      socketEmit(
        "detailSetting4",
        choiceDetailSettingChangeData(nutrientData, detailSetting4)
      );
    } else if (data == "detailSetting5") {
      const detailSetting5 = [
        "44208",
        "44209",
        "20",
        "52",
        "224",
        "225",
        "226",
        "227",
      ];

      socketEmit(
        "detailSetting5",
        choiceDetailSettingChangeData(nutrientData, detailSetting5)
      );
    } else if (data == "detailSetting6") {
      const detailSetting6 = [
        "44210",
        "44211",
        "21",
        "53",
        "240",
        "241",
        "242",
        "243",
      ];
      console.log("DetailSetting6");
      socketEmit(
        "detailSetting6",
        choiceDetailSettingChangeData(nutrientData, detailSetting6)
      );
    } else if (data == "detailSetting7") {
      const detailSetting7 = [
        "44212",
        "44213",
        "22",
        "54",
        "256",
        "257",
        "258",
        "259",
      ];

      socketEmit(
        "detailSetting7",
        choiceDetailSettingChangeData(nutrientData, detailSetting7)
      );
    } else if (data == "detailSetting8") {
      const detailSetting8 = [
        "44214",
        "44215",
        "23",
        "55",
        "272",
        "273",
        "274",
        "275",
      ];

      socketEmit(
        "detailSetting8",
        choiceDetailSettingChangeData(nutrientData, detailSetting8)
      );
    } else if (data == "detailSetting9") {
      const detailSetting9 = [
        "44216",
        "44217",
        "24",
        "56",
        "288",
        "289",
        "290",
        "291",
      ];

      socketEmit(
        "detailSetting9",
        choiceDetailSettingChangeData(nutrientData, detailSetting9)
      );
    } else if (data == "detailSetting10") {
      const detailSetting10 = [
        "44218",
        "44219",
        "25",
        "57",
        "304",
        "305",
        "306",
        "307",
      ];

      socketEmit(
        "detailSetting10",
        choiceDetailSettingChangeData(nutrientData, detailSetting10)
      );
    } else if (data == "detailSetting11") {
      const detailSetting11 = [
        "44220",
        "44221",
        "26",
        "58",
        "320",
        "321",
        "322",
        "323",
      ];

      socketEmit(
        "detailSetting11",
        choiceDetailSettingChangeData(nutrientData, detailSetting11)
      );
    } else if (data == "detailSetting12") {
      const detailSetting12 = [
        "44222",
        "44223",
        "27",
        "59",
        "336",
        "337",
        "338",
        "339",
      ];
      console.log("DetailSetting12");
      socketEmit(
        "detailSetting12",
        choiceDetailSettingChangeData(nutrientData, detailSetting12)
      );
    } else if (data == "detailSetting13") {
      const detailSetting13 = [
        "44224",
        "44225",
        "28",
        "60",
        "352",
        "353",
        "354",
        "355",
      ];
      console.log("DetailSetting13");
      socketEmit(
        "detailSetting13",
        choiceDetailSettingChangeData(nutrientData, detailSetting13)
      );
    } else if (data == "detailSetting14") {
      const detailSetting14 = [
        "44226",
        "44227",
        "29",
        "61",
        "368",
        "369",
        "370",
        "371",
      ];
      console.log("DetailSetting14");
      socketEmit(
        "detailSetting14",
        choiceDetailSettingChangeData(nutrientData, detailSetting14)
      );
    } else if (data == "detailSetting15") {
      const detailSetting15 = [
        "44228",
        "44229",
        "30",
        "62",
        "384",
        "385",
        "386",
        "387",
      ];
      console.log("DetailSetting15");
      socketEmit(
        "detailSetting15",
        choiceDetailSettingChangeData(nutrientData, detailSetting15)
      );
    } else if (data == "detailSetting16") {
      const detailSetting16 = [
        "44230",
        "44231",
        "31",
        "63",
        "401",
        "402",
        "403",
        "404",
      ];
      console.log("DetailSetting16");
      socketEmit(
        "detailSetting16",
        choiceDetailSettingChangeData(nutrientData, detailSetting16)
      );
    } else if (data == "detailSetting17") {
      const detailSetting17 = [
        "44232",
        "44233",
        "32",
        "64",
        "416",
        "417",
        "418",
        "419",
      ];
      console.log("DetailSetting17");
      socketEmit(
        "detailSetting17",
        choiceDetailSettingChangeData(nutrientData, detailSetting17)
      );
    } else if (data == "detailSetting18") {
      const detailSetting18 = [
        "44234",
        "44235",
        "33",
        "65",
        "432",
        "433",
        "434",
        "435",
      ];
      console.log("DetailSetting18");
      socketEmit(
        "detailSetting18",
        choiceDetailSettingChangeData(nutrientData, detailSetting18)
      );
    } else if (data == "detailSetting19") {
      const detailSetting19 = [
        "44236",
        "44237",
        "34",
        "66",
        "448",
        "449",
        "450",
        "451",
      ];
      console.log("DetailSetting19");
      socketEmit(
        "detailSetting19",
        choiceDetailSettingChangeData(nutrientData, detailSetting19)
      );
    } else if (data == "detailSetting20") {
      const detailSetting20 = [
        "44238",
        "44239",
        "35",
        "67",
        "464",
        "465",
        "466",
        "467",
      ];
      console.log("DetailSetting20");
      socketEmit(
        "detailSetting20",
        choiceDetailSettingChangeData(nutrientData, detailSetting20)
      );
    } else if (data == "detailSetting21") {
      const detailSetting21 = [
        "44240",
        "44241",
        "36",
        "68",
        "480",
        "481",
        "482",
        "483",
      ];
      console.log("DetailSetting21");
      socketEmit(
        "detailSetting21",
        choiceDetailSettingChangeData(nutrientData, detailSetting21)
      );
    } else if (data == "detailSetting22") {
      const detailSetting22 = [
        "44242",
        "44243",
        "37",
        "69",
        "496",
        "497",
        "498",
        "499",
      ];
      console.log("DetailSetting22");
      socketEmit(
        "detailSetting22",
        choiceDetailSettingChangeData(nutrientData, detailSetting22)
      );
    } else if (data == "detailSetting23") {
      const detailSetting23 = [
        "44244",
        "44245",
        "38",
        "70",
        "512",
        "513",
        "514",
        "515",
      ];
      console.log("DetailSetting23");
      socketEmit(
        "detailSetting23",
        choiceDetailSettingChangeData(nutrientData, detailSetting23)
      );
    } else if (data == "run") {
      const run = ["560"];
      console.log("run");
      socketEmit("run", choiceDetailSettingChangeData(nutrientData, run));
    } else if (data == "todaySupply") {
      const todaySupply = [
        "44520",
        "44521",
        "44522",
        "44523",
        "44524",
        "44525",
        "44526",
        "44527",
      ];
      console.log("todaySupply");
      socketEmit(
        "todaySupply",
        choiceDetailSettingChangeData(nutrientData, todaySupply)
      );
    }
  }

  function putNutrientData(name, quotation, address, list) {
    if (name != quotation) {
      list.push({
        modbus_address: address,
        description: name,
        property: "write",
      });
    }
  }

  function putCollection(body, addressList, list) {
    const { hour, minute, matter, isUse, tray1, tray2, tray3, tray4 } = body;

    putNutrientData(hour, quotation, addressList[0], list);
    putNutrientData(minute, quotation, addressList[1], list);
    putNutrientData(matter, quotation, addressList[2], list);
    putNutrientData(isUse, quotation, addressList[3], list);
    putNutrientData(tray1, quotation, addressList[4], list);
    putNutrientData(tray2, quotation, addressList[5], list);
    putNutrientData(tray3, quotation, addressList[6], list);
    putNutrientData(tray4, quotation, addressList[7], list);
  }

  function nutrientDetailSetting(body) {
    const { where } = body;

    const list = [];
    const quotation = "";
    if (body[where] == "detail1") {
      const addressList = [
        "44200",
        "44201",
        "16",
        "48",
        "160",
        "161",
        "162",
        "163",
      ];
      putCollection(body, addressList, list);
    } else if (where == "detail2") {
      const addressList = [
        "44202",
        "44203",
        "17",
        "49",
        "176",
        "177",
        "178",
        "179",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail3") {
      const addressList = [
        "44204",
        "44205",
        "17",
        "50",
        "192",
        "193",
        "194",
        "195",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail4") {
      const addressList = [
        "44206",
        "44207",
        "19",
        "51",
        "208",
        "209",
        "210",
        "211",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail5") {
      const addressList = [
        "44208",
        "44209",
        "20",
        "52",
        "224",
        "225",
        "226",
        "227",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail6") {
      const addressList = [
        "44210",
        "44211",
        "21",
        "53",
        "240",
        "241",
        "242",
        "243",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail7") {
      const addressList = [
        "44212",
        "44213",
        "22",
        "54",
        "256",
        "257",
        "258",
        "259",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail8") {
      const addressList = [
        "44214",
        "44215",
        "23",
        "55",
        "272",
        "273",
        "274",
        "275",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail9") {
      const addressList = [
        "44216",
        "44217",
        "24",
        "56",
        "288",
        "289",
        "290",
        "291",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail10") {
      const addressList = [
        "44218",
        "44219",
        "25",
        "57",
        "304",
        "305",
        "306",
        "307",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail11") {
      const addressList = [
        "44220",
        "44221",
        "26",
        "58",
        "320",
        "321",
        "322",
        "323",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail12") {
      const addressList = [
        "44222",
        "44223",
        "27",
        "59",
        "336",
        "337",
        "338",
        "339",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail13") {
      const addressList = [
        "44224",
        "44225",
        "28",
        "60",
        "352",
        "353",
        "354",
        "355",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail14") {
      const addressList = [
        "44226",
        "44227",
        "29",
        "61",
        "368",
        "369",
        "370",
        "371",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail15") {
      const addressList = [
        "44228",
        "44229",
        "30",
        "62",
        "384",
        "385",
        "386",
        "387",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail16") {
      const addressList = [
        "44230",
        "44231",
        "31",
        "63",
        "401",
        "402",
        "403",
        "404",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail17") {
      const addressList = [
        "44232",
        "44233",
        "32",
        "64",
        "416",
        "417",
        "418",
        "419",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail18") {
      const addressList = [
        "44234",
        "44235",
        "33",
        "65",
        "432",
        "433",
        "434",
        "435",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail19") {
      const addressList = [
        "44236",
        "44237",
        "34",
        "66",
        "448",
        "449",
        "450",
        "451",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail20") {
      const addressList = [
        "44238",
        "44239",
        "35",
        "67",
        "464",
        "465",
        "466",
        "467",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail21") {
      const addressList = [
        "44240",
        "44241",
        "36",
        "68",
        "480",
        "481",
        "482",
        "483",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail22") {
      const addressList = [
        "44242",
        "44243",
        "37",
        "69",
        "496",
        "497",
        "498",
        "499",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    } else if (where == "detail23") {
      const addressList = [
        "44244",
        "44245",
        "38",
        "70",
        "512",
        "513",
        "514",
        "515",
      ];
      putNutrientData(hour, quotation, addressList[0], list);
      putNutrientData(minute, quotation, addressList[1], list);
      putNutrientData(matter, quotation, addressList[2], list);
      putNutrientData(isUse, quotation, addressList[3], list);
      putNutrientData(tray1, quotation, addressList[4], list);
      putNutrientData(tray2, quotation, addressList[5], list);
      putNutrientData(tray3, quotation, addressList[6], list);
      putNutrientData(tray4, quotation, addressList[7], list);
    }
    return list;
  }
}

function invalidWhere(where) {
  const list = [
    "detail1",
    "detail2",
    "detail3",
    "detail4",
    "detail5",
    "detail6",
    "detail7",
    "detail8",
    "detail9",
    "detail10",
    "detail11",
    "detail12",
    "detail13",
    "detail14",
    "detail15",
    "detail16",
    "detail17",
    "detail18",
    "detail19",
    "detail20",
    "detail21",
    "detail22",
    "detail23",
  ];

  return !list.includes(where);
}

function invalidHourMinute(hour, minute) {
  return (
    Number(hour) < 0 ||
    Number(hour) > 23 ||
    Number(minute) < 0 ||
    Number(minute) > 59
  );
}

function invalidBinary(data) {
  const list = ["0", "1"];
  return !list.includes(data);
}

function invalidTray(data) {
  const list = ["tray1", "tray2", "tray3", "tray4"];
  return !list.includes(data);
}

module.exports = {
  detailHourMinute,
  easySetting,
  detailMatter,
  detailIsUse,
  detailTrayIsUse,
  nutricultureMachineList,
  whatDetailNumber,
  sendToNutricultureMachinePageSocket,
  invalidEasySetting,
  invalidWhere,
  invalidHourMinute,
  invalidBinary,
  invalidTray,
};
