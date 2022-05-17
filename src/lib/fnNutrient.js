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

  const list = [
    {
      modbus_address: "44100",
      description: easyStartHour,
      property: "write",
    },
    {
      modbus_address: "44101",
      description: easyStartMinute,
      property: "write",
    },
    {
      modbus_address: "44102",
      description: easyRepeatHour,
      property: "write",
    },
    {
      modbus_address: "44103",
      description: easyRepeatMinute,
      property: "write",
    },
    {
      modbus_address: "44104",
      description: easyRepeatCycle,
      property: "write",
    },
    {
      modbus_address: "44105",
      description: easyEcSetting,
      property: "write",
    },
    {
      modbus_address: "44106",
      description: easyPhSetting,
      property: "write",
    },
    {
      modbus_address: "44110",
      description: easySupplyTray1Minute,
      property: "write",
    },
    {
      modbus_address: "44111",
      description: easySupplyTray1Second,
      property: "write",
    },
    {
      modbus_address: "44112",
      description: easySupplyTray2Minute,
      property: "write",
    },
    {
      modbus_address: "44113",
      description: easySupplyTray2Second,
      property: "write",
    },
    {
      modbus_address: "44114",
      description: easySupplyTray3Minute,
      property: "write",
    },
    {
      modbus_address: "44115",
      description: easySupplyTray3Second,
      property: "write",
    },
    {
      modbus_address: "44116",
      description: easySupplyTray4Minute,
      property: "write",
    },
    {
      modbus_address: "44117",
      description: easySupplyTray4Second,
      property: "write",
    },
  ];

  return list;
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

module.exports = {
  detailHourMinute,
  easySetting,
  detailMatter,
  detailIsUse,
  detailTrayIsUse,
};
