function filteringDetailSettingData(body) {
  const {
    detail1Hour,
    detail1Minute,
    detail1Matter,
    detail1IsUse,
    detail1Tray1IsUse,
    detail1Tray2IsUse,
    detail1Tray3IsUse,
    detail1Tray4IsUse,
    detail2Hour,
    detail2Minute,
    detail2Matter,
    detail2IsUse,
    detail2Tray1IsUse,
    detail2Tray2IsUse,
    detail2Tray3IsUse,
    detail2Tray4IsUse,
    detail3Hour,
    detail3Minute,
    detail3Matter,
    detail3IsUse,
    detail3Tray1IsUse,
    detail3Tray2IsUse,
    detail3Tray3IsUse,
    detail3Tray4IsUse,
    detail4Hour,
    detail4Minute,
    detail4Matter,
    detail4IsUse,
    detail4Tray1IsUse,
    detail4Tray2IsUse,
    detail4Tray3IsUse,
    detail4Tray4IsUse,
    detail5Hour,
    detail5Minute,
    detail5Matter,
    detail5IsUse,
    detail5Tray1IsUse,
    detail5Tray2IsUse,
    detail5Tray3IsUse,
    detail5Tray4IsUse,
    detail6Hour,
    detail6Minute,
    detail6Matter,
    detail6IsUse,
    detail6Tray1IsUse,
    detail6Tray2IsUse,
    detail6Tray3IsUse,
    detail6Tray4IsUse,
    detail7Hour,
    detail7Minute,
    detail7Matter,
    detail7IsUse,
    detail7Tray1IsUse,
    detail7Tray2IsUse,
    detail7Tray3IsUse,
    detail7Tray4IsUse,
    detail8Hour,
    detail8Minute,
    detail8Matter,
    detail8IsUse,
    detail8Tray1IsUse,
    detail8Tray2IsUse,
    detail8Tray3IsUse,
    detail8Tray4IsUse,
    detail9Hour,
    detail9Minute,
    detail9Matter,
    detail9IsUse,
    detail9Tray1IsUse,
    detail9Tray2IsUse,
    detail9Tray3IsUse,
    detail9Tray4IsUse,
    detail10Hour,
    detail10Minute,
    detail10Matter,
    detail10IsUse,
    detail10Tray1IsUse,
    detail10Tray2IsUse,
    detail10Tray3IsUse,
    detail10Tray4IsUse,
    detail11Hour,
    detail11Minute,
    detail11Matter,
    detail11IsUse,
    detail11Tray1IsUse,
    detail11Tray2IsUse,
    detail11Tray3IsUse,
    detail11Tray4IsUse,
    detail12Hour,
    detail12Minute,
    detail12Matter,
    detail12IsUse,
    detail12Tray1IsUse,
    detail12Tray2IsUse,
    detail12Tray3IsUse,
    detail12Tray4IsUse,
    detail13Hour,
    detail13Minute,
    detail13Matter,
    detail13IsUse,
    detail13Tray1IsUse,
    detail13Tray2IsUse,
    detail13Tray3IsUse,
    detail13Tray4IsUse,
    detail14Hour,
    detail14Minute,
    detail14Matter,
    detail14IsUse,
    detail14Tray1IsUse,
    detail14Tray2IsUse,
    detail14Tray3IsUse,
    detail14Tray4IsUse,
    detail15Hour,
    detail15Minute,
    detail15Matter,
    detail15IsUse,
    detail15Tray1IsUse,
    detail15Tray2IsUse,
    detail15Tray3IsUse,
    detail15Tray4IsUse,
    detail16Hour,
    detail16Minute,
    detail16Matter,
    detail16IsUse,
    detail16Tray1IsUse,
    detail16Tray2IsUse,
    detail16Tray3IsUse,
    detail16Tray4IsUse,
    detail17Hour,
    detail17Minute,
    detail17Matter,
    detail17IsUse,
    detail17Tray1IsUse,
    detail17Tray2IsUse,
    detail17Tray3IsUse,
    detail17Tray4IsUse,
    detail18Hour,
    detail18Minute,
    detail18Matter,
    detail18IsUse,
    detail18Tray1IsUse,
    detail18Tray2IsUse,
    detail18Tray3IsUse,
    detail18Tray4IsUse,
    detail19Hour,
    detail19Minute,
    detail19Matter,
    detail19IsUse,
    detail19Tray1IsUse,
    detail19Tray2IsUse,
    detail19Tray3IsUse,
    detail19Tray4IsUse,
    detail20Hour,
    detail20Minute,
    detail20Matter,
    detail20IsUse,
    detail20Tray1IsUse,
    detail20Tray2IsUse,
    detail20Tray3IsUse,
    detail20Tray4IsUse,
    detail21Hour,
    detail21Minute,
    detail21Matter,
    detail21IsUse,
    detail21Tray1IsUse,
    detail21Tray2IsUse,
    detail21Tray3IsUse,
    detail21Tray4IsUse,
    detail22Hour,
    detail22Minute,
    detail22Matter,
    detail22IsUse,
    detail22Tray1IsUse,
    detail22Tray2IsUse,
    detail22Tray3IsUse,
    detail22Tray4IsUse,
    detail23Hour,
    detail23Minute,
    detail23Matter,
    detail23IsUse,
    detail23Tray1IsUse,
    detail23Tray2IsUse,
    detail23Tray3IsUse,
    detail23Tray4IsUse,
    detailTray1SupplySettingMinute,
    detailTray1SupplySettingSecond,
    detailTray2SupplySettingMinute,
    detailTray2SupplySettingSecond,
    detailTray3SupplySettingMinute,
    detailTray3SupplySettingSecond,
    detailTray4SupplySettingMinute,
    detailTray4SupplySettingSecond,
    tray1EcSetting,
    tray2EcSetting,
    tray3EcSetting,
    tray4EcSetting,
    tray1PhSetting,
    tray2PhSetting,
    tray3PhSetting,
    tray4PhSetting,
  } = body;
  const list = [];
  const par = "";

  if (detail1Hour !== par) {
    list.push({
      modbus_address: "44200",
      description: detail1Hour,
      property: "write",
    });
  }
  if (detail1Minute !== par) {
    list.push({
      modbus_address: "44201",
      description: detail1Minute,
      property: "write",
    });
  }
  if (detail1Matter !== par) {
    list.push({
      modbus_address: "16",
      description: detail1Matter,
      property: "write",
    });
  }
  if (detail1IsUse !== par) {
    list.push({
      modbus_address: "48",
      description: detail1IsUse,
      property: "write",
    });
  }
  if (detail1Tray1IsUse !== par) {
    list.push({
      modbus_address: "160",
      description: detail1Tray1IsUse,
      property: "write",
    });
  }
  if (detail1Tray2IsUse !== par) {
    list.push({
      modbus_address: "161",
      description: detail1Tray2IsUse,
      property: "write",
    });
  }
  if (detail1Tray3IsUse !== par) {
    list.push({
      modbus_address: "162",
      description: detail1Tray3IsUse,
      property: "write",
    });
  }
  if (detail1Tray4IsUse !== par) {
    list.push({
      modbus_address: "163",
      description: detail1Tray4IsUse,
      property: "write",
    });
  }
  if (detail2Hour !== par) {
    list.push({
      modbus_address: "44202",
      description: detail2Hour,
      property: "write",
    });
  }
  if (detail2Minute !== par) {
    list.push({
      modbus_address: "44203",
      description: detail2Minute,
      property: "write",
    });
  }
  if (detail2Matter !== par) {
    list.push({
      modbus_address: "17",
      description: detail2Matter,
      property: "write",
    });
  }
  if (detail2IsUse !== par) {
    list.push({
      modbus_address: "49",
      description: detail2IsUse,
      property: "write",
    });
  }
  if (detail2Tray1IsUse !== par) {
    list.push({
      modbus_address: "176",
      description: detail2Tray1IsUse,
      property: "write",
    });
  }
  if (detail2Tray2IsUse !== par) {
    list.push({
      modbus_address: "177",
      description: detail2Tray2IsUse,
      property: "write",
    });
  }
  if (detail2Tray3IsUse !== par) {
    list.push({
      modbus_address: "178",
      description: detail2Tray3IsUse,
      property: "write",
    });
  }
  if (detail2Tray4IsUse !== par) {
    list.push({
      modbus_address: "179",
      description: detail2Tray4IsUse,
      property: "write",
    });
  }
  if (detail3Hour !== par) {
    list.push({
      modbus_address: "44204",
      description: detail3Hour,
      property: "write",
    });
  }
  if (detail3Minute !== par) {
    list.push({
      modbus_address: "44205",
      description: detail3Minute,
      property: "write",
    });
  }
  if (detail3Matter !== par) {
    list.push({
      modbus_address: "18",
      description: detail3Matter,
      property: "write",
    });
  }
  if (detail3IsUse !== par) {
    list.push({
      modbus_address: "50",
      description: detail3IsUse,
      property: "write",
    });
  }
  if (detail3Tray1IsUse !== par) {
    list.push({
      modbus_address: "192",
      description: detail3Tray1IsUse,
      property: "write",
    });
  }
  if (detail3Tray2IsUse !== par) {
    list.push({
      modbus_address: "193",
      description: detail3Tray2IsUse,
      property: "write",
    });
  }
  if (detail3Tray3IsUse !== par) {
    list.push({
      modbus_address: "194",
      description: detail3Tray3IsUse,
      property: "write",
    });
  }
  if (detail3Tray4IsUse !== par) {
    list.push({
      modbus_address: "195",
      description: detail3Tray4IsUse,
      property: "write",
    });
  }
  if (detail4Hour !== par) {
    list.push({
      modbus_address: "44206",
      description: detail4Hour,
      property: "write",
    });
  }
  if (detail4Minute !== par) {
    list.push({
      modbus_address: "44207",
      description: detail4Minute,
      property: "write",
    });
  }
  if (detail4Matter !== par) {
    list.push({
      modbus_address: "19",
      description: detail4Matter,
      property: "write",
    });
  }
  if (detail4IsUse !== par) {
    list.push({
      modbus_address: "51",
      description: detail4IsUse,
      property: "write",
    });
  }
  if (detail4Tray1IsUse !== par) {
    list.push({
      modbus_address: "208",
      description: detail4Tray1IsUse,
      property: "write",
    });
  }
  if (detail4Tray2IsUse !== par) {
    list.push({
      modbus_address: "209",
      description: detail4Tray2IsUse,
      property: "write",
    });
  }
  if (detail4Tray3IsUse !== par) {
    list.push({
      modbus_address: "210",
      description: detail4Tray3IsUse,
      property: "write",
    });
  }
  if (detail4Tray4IsUse !== par) {
    list.push({
      modbus_address: "211",
      description: detail4Tray4IsUse,
      property: "write",
    });
  }
  if (detail5Hour !== par) {
    list.push({
      modbus_address: "44208",
      description: detail5Hour,
      property: "write",
    });
  }
  if (detail5Minute !== par) {
    list.push({
      modbus_address: "44209",
      description: detail5Minute,
      property: "write",
    });
  }
  if (detail5Matter !== par) {
    list.push({
      modbus_address: "20",
      description: detail5Matter,
      property: "write",
    });
  }
  if (detail5IsUse !== par) {
    list.push({
      modbus_address: "52",
      description: detail5IsUse,
      property: "write",
    });
  }
  if (detail5Tray1IsUse !== par) {
    list.push({
      modbus_address: "224",
      description: detail5Tray1IsUse,
      property: "write",
    });
  }
  if (detail5Tray2IsUse !== par) {
    list.push({
      modbus_address: "225",
      description: detail5Tray2IsUse,
      property: "write",
    });
  }
  if (detail5Tray3IsUse !== par) {
    list.push({
      modbus_address: "226",
      description: detail5Tray3IsUse,
      property: "write",
    });
  }
  if (detail5Tray4IsUse !== par) {
    list.push({
      modbus_address: "227",
      description: detail5Tray4IsUse,
      property: "write",
    });
  }
  if (detail6Hour !== par) {
    list.push({
      modbus_address: "44210",
      description: detail6Hour,
      property: "write",
    });
  }
  if (detail6Minute !== par) {
    list.push({
      modbus_address: "44211",
      description: detail6Minute,
      property: "write",
    });
  }
  if (detail6Matter !== par) {
    list.push({
      modbus_address: "21",
      description: detail6Matter,
      property: "write",
    });
  }
  if (detail6IsUse !== par) {
    list.push({
      modbus_address: "53",
      description: detail6IsUse,
      property: "write",
    });
  }
  if (detail6Tray1IsUse !== par) {
    list.push({
      modbus_address: "240",
      description: detail6Tray1IsUse,
      property: "write",
    });
  }
  if (detail6Tray2IsUse !== par) {
    list.push({
      modbus_address: "241",
      description: detail6Tray2IsUse,
      property: "write",
    });
  }
  if (detail6Tray3IsUse !== par) {
    list.push({
      modbus_address: "242",
      description: detail6Tray3IsUse,
      property: "write",
    });
  }
  if (detail6Tray4IsUse !== par) {
    list.push({
      modbus_address: "243",
      description: detail6Tray4IsUse,
      property: "write",
    });
  }
  if (detail7Hour !== par) {
    list.push({
      modbus_address: "44212",
      description: detail7Hour,
      property: "write",
    });
  }
  if (detail7Minute !== par) {
    list.push({
      modbus_address: "44213",
      description: detail7Minute,
      property: "write",
    });
  }
  if (detail7Matter !== par) {
    list.push({
      modbus_address: "22",
      description: detail7Matter,
      property: "write",
    });
  }
  if (detail7IsUse !== par) {
    list.push({
      modbus_address: "54",
      description: detail7IsUse,
      property: "write",
    });
  }
  if (detail7Tray1IsUse !== par) {
    list.push({
      modbus_address: "256",
      description: detail7Tray1IsUse,
      property: "write",
    });
  }
  if (detail7Tray2IsUse !== par) {
    list.push({
      modbus_address: "257",
      description: detail7Tray2IsUse,
      property: "write",
    });
  }
  if (detail7Tray3IsUse !== par) {
    list.push({
      modbus_address: "258",
      description: detail7Tray3IsUse,
      property: "write",
    });
  }
  if (detail7Tray4IsUse !== par) {
    list.push({
      modbus_address: "259",
      description: detail7Tray4IsUse,
      property: "write",
    });
  }
  if (detail8Hour !== par) {
    list.push({
      modbus_address: "44214",
      description: detail8Hour,
      property: "write",
    });
  }
  if (detail8Minute !== par) {
    list.push({
      modbus_address: "44215",
      description: detail8Minute,
      property: "write",
    });
  }
  if (detail8Matter !== par) {
    list.push({
      modbus_address: "23",
      description: detail8Matter,
      property: "write",
    });
  }
  if (detail8IsUse !== par) {
    list.push({
      modbus_address: "55",
      description: detail8IsUse,
      property: "write",
    });
  }
  if (detail8Tray1IsUse !== par) {
    list.push({
      modbus_address: "272",
      description: detail8Tray1IsUse,
      property: "write",
    });
  }
  if (detail8Tray2IsUse !== par) {
    list.push({
      modbus_address: "273",
      description: detail8Tray2IsUse,
      property: "write",
    });
  }
  if (detail8Tray3IsUse !== par) {
    list.push({
      modbus_address: "274",
      description: detail8Tray3IsUse,
      property: "write",
    });
  }
  if (detail8Tray4IsUse !== par) {
    list.push({
      modbus_address: "275",
      description: detail8Tray4IsUse,
      property: "write",
    });
  }
  if (detail9Hour !== par) {
    list.push({
      modbus_address: "44216",
      description: detail9Hour,
      property: "write",
    });
  }
  if (detail9Minute !== par) {
    list.push({
      modbus_address: "44217",
      description: detail9Minute,
      property: "write",
    });
  }
  if (detail9Matter !== par) {
    list.push({
      modbus_address: "24",
      description: detail9Matter,
      property: "write",
    });
  }
  if (detail9IsUse !== par) {
    list.push({
      modbus_address: "56",
      description: detail9IsUse,
      property: "write",
    });
  }
  if (detail9Tray1IsUse !== par) {
    list.push({
      modbus_address: "288",
      description: detail9Tray1IsUse,
      property: "write",
    });
  }
  if (detail9Tray2IsUse !== par) {
    list.push({
      modbus_address: "289",
      description: detail9Tray2IsUse,
      property: "write",
    });
  }
  if (detail9Tray3IsUse !== par) {
    list.push({
      modbus_address: "290",
      description: detail9Tray3IsUse,
      property: "write",
    });
  }
  if (detail9Tray4IsUse !== par) {
    list.push({
      modbus_address: "291",
      description: detail9Tray4IsUse,
      property: "write",
    });
  }
  if (detail10Hour !== par) {
    list.push({
      modbus_address: "44218",
      description: detail10Hour,
      property: "write",
    });
  }
  if (detail10Minute !== par) {
    list.push({
      modbus_address: "44219",
      description: detail10Minute,
      property: "write",
    });
  }
  if (detail10Matter !== par) {
    list.push({
      modbus_address: "25",
      description: detail10Matter,
      property: "write",
    });
  }
  if (detail10IsUse !== par) {
    list.push({
      modbus_address: "57",
      description: detail10IsUse,
      property: "write",
    });
  }
  if (detail10Tray1IsUse !== par) {
    list.push({
      modbus_address: "304",
      description: detail10Tray1IsUse,
      property: "write",
    });
  }
  if (detail10Tray2IsUse !== par) {
    list.push({
      modbus_address: "305",
      description: detail10Tray2IsUse,
      property: "write",
    });
  }
  if (detail10Tray3IsUse !== par) {
    list.push({
      modbus_address: "306",
      description: detail10Tray3IsUse,
      property: "write",
    });
  }
  if (detail10Tray4IsUse !== par) {
    list.push({
      modbus_address: "307",
      description: detail10Tray4IsUse,
      property: "write",
    });
  }
  if (detail11Hour !== par) {
    list.push({
      modbus_address: "44220",
      description: detail11Hour,
      property: "write",
    });
  }
  if (detail11Minute !== par) {
    list.push({
      modbus_address: "44221",
      description: detail11Minute,
      property: "write",
    });
  }
  if (detail11Matter !== par) {
    list.push({
      modbus_address: "26",
      description: detail11Matter,
      property: "write",
    });
  }
  if (detail11IsUse !== par) {
    list.push({
      modbus_address: "58",
      description: detail11IsUse,
      property: "write",
    });
  }
  if (detail11Tray1IsUse !== par) {
    list.push({
      modbus_address: "320",
      description: detail11Tray1IsUse,
      property: "write",
    });
  }
  if (detail11Tray2IsUse !== par) {
    list.push({
      modbus_address: "321",
      description: detail11Tray2IsUse,
      property: "write",
    });
  }
  if (detail11Tray3IsUse !== par) {
    list.push({
      modbus_address: "322",
      description: detail11Tray3IsUse,
      property: "write",
    });
  }
  if (detail11Tray4IsUse !== par) {
    list.push({
      modbus_address: "323",
      description: detail11Tray4IsUse,
      property: "write",
    });
  }
  if (detail12Hour !== par) {
    list.push({
      modbus_address: "44222",
      description: detail12Hour,
      property: "write",
    });
  }
  if (detail12Minute !== par) {
    list.push({
      modbus_address: "44223",
      description: detail12Minute,
      property: "write",
    });
  }
  if (detail12Matter !== par) {
    list.push({
      modbus_address: "27",
      description: detail12Matter,
      property: "write",
    });
  }
  if (detail12IsUse !== par) {
    list.push({
      modbus_address: "59",
      description: detail12IsUse,
      property: "write",
    });
  }
  if (detail12Tray1IsUse !== par) {
    list.push({
      modbus_address: "336",
      description: detail12Tray1IsUse,
      property: "write",
    });
  }
  if (detail12Tray2IsUse !== par) {
    list.push({
      modbus_address: "337",
      description: detail12Tray2IsUse,
      property: "write",
    });
  }
  if (detail12Tray3IsUse !== par) {
    list.push({
      modbus_address: "338",
      description: detail12Tray3IsUse,
      property: "write",
    });
  }
  if (detail12Tray4IsUse !== par) {
    list.push({
      modbus_address: "339",
      description: detail12Tray4IsUse,
      property: "write",
    });
  }
  if (detail13Hour !== par) {
    list.push({
      modbus_address: "44224",
      description: detail13Hour,
      property: "write",
    });
  }
  if (detail13Minute !== par) {
    list.push({
      modbus_address: "44225",
      description: detail13Minute,
      property: "write",
    });
  }
  if (detail13Matter !== par) {
    list.push({
      modbus_address: "28",
      description: detail13Matter,
      property: "write",
    });
  }
  if (detail13IsUse !== par) {
    list.push({
      modbus_address: "60",
      description: detail13IsUse,
      property: "write",
    });
  }
  if (detail13Tray1IsUse !== par) {
    list.push({
      modbus_address: "352",
      description: detail13Tray1IsUse,
      property: "write",
    });
  }
  if (detail13Tray2IsUse !== par) {
    list.push({
      modbus_address: "353",
      description: detail13Tray2IsUse,
      property: "write",
    });
  }
  if (detail13Tray3IsUse !== par) {
    list.push({
      modbus_address: "354",
      description: detail13Tray3IsUse,
      property: "write",
    });
  }
  if (detail13Tray4IsUse !== par) {
    list.push({
      modbus_address: "355",
      description: detail13Tray4IsUse,
      property: "write",
    });
  }
  if (detail14Hour !== par) {
    list.push({
      modbus_address: "44226",
      description: detail14Hour,
      property: "write",
    });
  }
  if (detail14Minute !== par) {
    list.push({
      modbus_address: "44227",
      description: detail14Minute,
      property: "write",
    });
  }
  if (detail14Matter !== par) {
    list.push({
      modbus_address: "29",
      description: detail14Matter,
      property: "write",
    });
  }
  if (detail14IsUse !== par) {
    list.push({
      modbus_address: "61",
      description: detail14IsUse,
      property: "write",
    });
  }
  if (detail14Tray1IsUse !== par) {
    list.push({
      modbus_address: "368",
      description: detail14Tray1IsUse,
      property: "write",
    });
  }
  if (detail14Tray2IsUse !== par) {
    list.push({
      modbus_address: "369",
      description: detail14Tray2IsUse,
      property: "write",
    });
  }
  if (detail14Tray3IsUse !== par) {
    list.push({
      modbus_address: "370",
      description: detail14Tray3IsUse,
      property: "write",
    });
  }
  if (detail14Tray4IsUse !== par) {
    list.push({
      modbus_address: "371",
      description: detail14Tray4IsUse,
      property: "write",
    });
  }
  if (detail15Hour !== par) {
    list.push({
      modbus_address: "44228",
      description: detail15Hour,
      property: "write",
    });
  }
  if (detail15Minute !== par) {
    list.push({
      modbus_address: "44229",
      description: detail15Minute,
      property: "write",
    });
  }
  if (detail15Matter !== par) {
    list.push({
      modbus_address: "30",
      description: detail15Matter,
      property: "write",
    });
  }
  if (detail15IsUse !== par) {
    list.push({
      modbus_address: "62",
      description: detail15IsUse,
      property: "write",
    });
  }
  if (detail15Tray1IsUse !== par) {
    list.push({
      modbus_address: "384",
      description: detail15Tray1IsUse,
      property: "write",
    });
  }
  if (detail15Tray2IsUse !== par) {
    list.push({
      modbus_address: "385",
      description: detail15Tray2IsUse,
      property: "write",
    });
  }
  if (detail15Tray3IsUse !== par) {
    list.push({
      modbus_address: "386",
      description: detail15Tray3IsUse,
      property: "write",
    });
  }
  if (detail15Tray4IsUse !== par) {
    list.push({
      modbus_address: "387",
      description: detail15Tray4IsUse,
      property: "write",
    });
  }
  if (detail16Hour !== par) {
    list.push({
      modbus_address: "44230",
      description: detail16Hour,
      property: "write",
    });
  }
  if (detail16Minute !== par) {
    list.push({
      modbus_address: "44231",
      description: detail16Minute,
      property: "write",
    });
  }
  if (detail16Matter !== par) {
    list.push({
      modbus_address: "31",
      description: detail16Matter,
      property: "write",
    });
  }
  if (detail16IsUse !== par) {
    list.push({
      modbus_address: "63",
      description: detail16IsUse,
      property: "write",
    });
  }
  if (detail16Tray1IsUse !== par) {
    list.push({
      modbus_address: "400",
      description: detail16Tray1IsUse,
      property: "write",
    });
  }
  if (detail16Tray2IsUse !== par) {
    list.push({
      modbus_address: "401",
      description: detail16Tray2IsUse,
      property: "write",
    });
  }
  if (detail16Tray3IsUse !== par) {
    list.push({
      modbus_address: "402",
      description: detail16Tray3IsUse,
      property: "write",
    });
  }
  if (detail16Tray4IsUse !== par) {
    list.push({
      modbus_address: "403",
      description: detail16Tray4IsUse,
      property: "write",
    });
  }
  if (detail17Hour !== par) {
    list.push({
      modbus_address: "44232",
      description: detail17Hour,
      property: "write",
    });
  }
  if (detail17Minute !== par) {
    list.push({
      modbus_address: "44233",
      description: detail17Minute,
      property: "write",
    });
  }
  if (detail17Matter !== par) {
    list.push({
      modbus_address: "32",
      description: detail17Matter,
      property: "write",
    });
  }
  if (detail17IsUse !== par) {
    list.push({
      modbus_address: "64",
      description: detail17IsUse,
      property: "write",
    });
  }
  if (detail17Tray1IsUse !== par) {
    list.push({
      modbus_address: "416",
      description: detail17Tray1IsUse,
      property: "write",
    });
  }
  if (detail17Tray2IsUse !== par) {
    list.push({
      modbus_address: "417",
      description: detail17Tray2IsUse,
      property: "write",
    });
  }
  if (detail17Tray3IsUse !== par) {
    list.push({
      modbus_address: "418",
      description: detail17Tray3IsUse,
      property: "write",
    });
  }
  if (detail17Tray4IsUse !== par) {
    list.push({
      modbus_address: "419",
      description: detail17Tray4IsUse,
      property: "write",
    });
  }
  if (detail18Hour !== par) {
    list.push({
      modbus_address: "44234",
      description: detail18Hour,
      property: "write",
    });
  }
  if (detail18Minute !== par) {
    list.push({
      modbus_address: "44235",
      description: detail18Minute,
      property: "write",
    });
  }
  if (detail18Matter !== par) {
    list.push({
      modbus_address: "33",
      description: detail18Matter,
      property: "write",
    });
  }
  if (detail18IsUse !== par) {
    list.push({
      modbus_address: "65",
      description: detail18IsUse,
      property: "write",
    });
  }
  if (detail18Tray1IsUse !== par) {
    list.push({
      modbus_address: "432",
      description: detail18Tray1IsUse,
      property: "write",
    });
  }
  if (detail18Tray2IsUse !== par) {
    list.push({
      modbus_address: "433",
      description: detail18Tray2IsUse,
      property: "write",
    });
  }
  if (detail18Tray3IsUse !== par) {
    list.push({
      modbus_address: "434",
      description: detail18Tray3IsUse,
      property: "write",
    });
  }
  if (detail18Tray4IsUse !== par) {
    list.push({
      modbus_address: "435",
      description: detail18Tray4IsUse,
      property: "write",
    });
  }
  if (detail19Hour !== par) {
    list.push({
      modbus_address: "44236",
      description: detail19Hour,
      property: "write",
    });
  }
  if (detail19Minute !== par) {
    list.push({
      modbus_address: "44237",
      description: detail19Minute,
      property: "write",
    });
  }
  if (detail19Matter !== par) {
    list.push({
      modbus_address: "34",
      description: detail19Matter,
      property: "write",
    });
  }
  if (detail19IsUse !== par) {
    list.push({
      modbus_address: "66",
      description: detail19IsUse,
      property: "write",
    });
  }
  if (detail19Tray1IsUse !== par) {
    list.push({
      modbus_address: "448",
      description: detail19Tray1IsUse,
      property: "write",
    });
  }
  if (detail19Tray2IsUse !== par) {
    list.push({
      modbus_address: "449",
      description: detail19Tray2IsUse,
      property: "write",
    });
  }
  if (detail19Tray3IsUse !== par) {
    list.push({
      modbus_address: "450",
      description: detail19Tray3IsUse,
      property: "write",
    });
  }
  if (detail19Tray4IsUse !== par) {
    list.push({
      modbus_address: "451",
      description: detail19Tray4IsUse,
      property: "write",
    });
  }
  if (detail20Hour !== par) {
    list.push({
      modbus_address: "44238",
      description: detail20Hour,
      property: "write",
    });
  }
  if (detail20Minute !== par) {
    list.push({
      modbus_address: "44239",
      description: detail20Minute,
      property: "write",
    });
  }
  if (detail20Matter !== par) {
    list.push({
      modbus_address: "35",
      description: detail20Matter,
      property: "write",
    });
  }
  if (detail20IsUse !== par) {
    list.push({
      modbus_address: "67",
      description: detail20IsUse,
      property: "write",
    });
  }
  if (detail20Tray1IsUse !== par) {
    list.push({
      modbus_address: "464",
      description: detail20Tray1IsUse,
      property: "write",
    });
  }
  if (detail20Tray2IsUse !== par) {
    list.push({
      modbus_address: "465",
      description: detail20Tray2IsUse,
      property: "write",
    });
  }
  if (detail20Tray3IsUse !== par) {
    list.push({
      modbus_address: "466",
      description: detail20Tray3IsUse,
      property: "write",
    });
  }
  if (detail20Tray4IsUse !== par) {
    list.push({
      modbus_address: "467",
      description: detail20Tray4IsUse,
      property: "write",
    });
  }
  if (detail21Hour !== par) {
    list.push({
      modbus_address: "44240",
      description: detail21Hour,
      property: "write",
    });
  }
  if (detail21Minute !== par) {
    list.push({
      modbus_address: "44241",
      description: detail21Minute,
      property: "write",
    });
  }
  if (detail21Matter !== par) {
    list.push({
      modbus_address: "36",
      description: detail21Matter,
      property: "write",
    });
  }
  if (detail21IsUse !== par) {
    list.push({
      modbus_address: "68",
      description: detail21IsUse,
      property: "write",
    });
  }
  if (detail21Tray1IsUse !== par) {
    list.push({
      modbus_address: "480",
      description: detail21Tray1IsUse,
      property: "write",
    });
  }
  if (detail21Tray2IsUse !== par) {
    list.push({
      modbus_address: "481",
      description: detail21Tray2IsUse,
      property: "write",
    });
  }
  if (detail21Tray3IsUse !== par) {
    list.push({
      modbus_address: "482",
      description: detail21Tray3IsUse,
      property: "write",
    });
  }
  if (detail21Tray4IsUse !== par) {
    list.push({
      modbus_address: "483",
      description: detail21Tray4IsUse,
      property: "write",
    });
  }
  if (detail22Hour !== par) {
    list.push({
      modbus_address: "44242",
      description: detail22Hour,
      property: "write",
    });
  }
  if (detail22Minute !== par) {
    list.push({
      modbus_address: "44243",
      description: detail22Minute,
      property: "write",
    });
  }
  if (detail22Matter !== par) {
    list.push({
      modbus_address: "37",
      description: detail22Matter,
      property: "write",
    });
  }
  if (detail22IsUse !== par) {
    list.push({
      modbus_address: "69",
      description: detail22IsUse,
      property: "write",
    });
  }
  if (detail22Tray1IsUse !== par) {
    list.push({
      modbus_address: "496",
      description: detail22Tray1IsUse,
      property: "write",
    });
  }
  if (detail22Tray2IsUse !== par) {
    list.push({
      modbus_address: "497",
      description: detail22Tray2IsUse,
      property: "write",
    });
  }
  if (detail22Tray3IsUse !== par) {
    list.push({
      modbus_address: "498",
      description: detail22Tray3IsUse,
      property: "write",
    });
  }
  if (detail22Tray4IsUse !== par) {
    list.push({
      modbus_address: "499",
      description: detail22Tray4IsUse,
      property: "write",
    });
  }
  if (detail23Hour !== par) {
    list.push({
      modbus_address: "44244",
      description: detail23Hour,
      property: "write",
    });
  }
  if (detail23Minute !== par) {
    list.push({
      modbus_address: "44245",
      description: detail23Minute,
      property: "write",
    });
  }
  if (detail23Matter !== par) {
    list.push({
      modbus_address: "38",
      description: detail23Matter,
      property: "write",
    });
  }
  if (detail23IsUse !== par) {
    list.push({
      modbus_address: "70",
      description: detail23IsUse,
      property: "write",
    });
  }
  if (detail23Tray1IsUse !== par) {
    list.push({
      modbus_address: "512",
      description: detail23Tray1IsUse,
      property: "write",
    });
  }
  if (detail23Tray2IsUse !== par) {
    list.push({
      modbus_address: "513",
      description: detail23Tray2IsUse,
      property: "write",
    });
  }
  if (detail23Tray3IsUse !== par) {
    list.push({
      modbus_address: "514",
      description: detail23Tray3IsUse,
      property: "write",
    });
  }
  if (detail23Tray4IsUse !== par) {
    list.push({
      modbus_address: "515",
      description: detail23Tray4IsUse,
      property: "write",
    });
  }
  if (detailTray1SupplySettingMinute !== par) {
    list.push({
      modbus_address: "44300",
      description: detailTray1SupplySettingMinute,
      property: "write",
    });
  }
  if (detailTray1SupplySettingSecond !== par) {
    list.push({
      modbus_address: "44301",
      description: detailTray1SupplySettingSecond,
      property: "write",
    });
  }
  if (detailTray2SupplySettingMinute !== par) {
    list.push({
      modbus_address: "44302",
      description: detailTray2SupplySettingMinute,
      property: "write",
    });
  }
  if (detailTray2SupplySettingSecond !== par) {
    list.push({
      modbus_address: "44303",
      description: detailTray2SupplySettingSecond,
      property: "write",
    });
  }
  if (detailTray3SupplySettingMinute !== par) {
    list.push({
      modbus_address: "44304",
      description: detailTray3SupplySettingMinute,
      property: "write",
    });
  }
  if (detailTray3SupplySettingSecond !== par) {
    list.push({
      modbus_address: "44305",
      description: detailTray3SupplySettingSecond,
      property: "write",
    });
  }
  if (detailTray4SupplySettingMinute !== par) {
    list.push({
      modbus_address: "44306",
      description: detailTray4SupplySettingMinute,
      property: "write",
    });
  }
  if (detailTray4SupplySettingSecond !== par) {
    list.push({
      modbus_address: "44307",
      description: detailTray4SupplySettingSecond,
      property: "write",
    });
  }
  if (tray1EcSetting !== par) {
    list.push({
      modbus_address: "44360",
      description: tray1EcSetting,
      property: "write",
    });
  }
  if (tray2EcSetting !== par) {
    list.push({
      modbus_address: "44361",
      description: tray2EcSetting,
      property: "write",
    });
  }
  if (tray3EcSetting !== par) {
    list.push({
      modbus_address: "44362",
      description: tray3EcSetting,
      property: "write",
    });
  }
  if (tray4EcSetting !== par) {
    list.push({
      modbus_address: "44363",
      description: tray4EcSetting,
      property: "write",
    });
  }
  if (tray1PhSetting !== par) {
    list.push({
      modbus_address: "44380",
      description: tray1PhSetting,
      property: "write",
    });
  }
  if (tray2PhSetting !== par) {
    list.push({
      modbus_address: "44381",
      description: tray2PhSetting,
      property: "write",
    });
  }
  if (tray3PhSetting !== par) {
    list.push({
      modbus_address: "44382",
      description: tray3PhSetting,
      property: "write",
    });
  }
  if (tray4PhSetting !== par) {
    list.push({
      modbus_address: "44383",
      description: tray4PhSetting,
      property: "write",
    });
  }

  return list;
}

function invalidDetailSettingData(body) {
  const {
    detail1Hour,
    detail1Minute,
    detail1Matter,
    detail1IsUse,
    detail1Tray1IsUse,
    detail1Tray2IsUse,
    detail1Tray3IsUse,
    detail1Tray4IsUse,
    detail2Hour,
    detail2Minute,
    detail2Matter,
    detail2IsUse,
    detail2Tray1IsUse,
    detail2Tray2IsUse,
    detail2Tray3IsUse,
    detail2Tray4IsUse,
    detail3Hour,
    detail3Minute,
    detail3Matter,
    detail3IsUse,
    detail3Tray1IsUse,
    detail3Tray2IsUse,
    detail3Tray3IsUse,
    detail3Tray4IsUse,
    detail4Hour,
    detail4Minute,
    detail4Matter,
    detail4IsUse,
    detail4Tray1IsUse,
    detail4Tray2IsUse,
    detail4Tray3IsUse,
    detail4Tray4IsUse,
    detail5Hour,
    detail5Minute,
    detail5Matter,
    detail5IsUse,
    detail5Tray1IsUse,
    detail5Tray2IsUse,
    detail5Tray3IsUse,
    detail5Tray4IsUse,
    detail6Hour,
    detail6Minute,
    detail6Matter,
    detail6IsUse,
    detail6Tray1IsUse,
    detail6Tray2IsUse,
    detail6Tray3IsUse,
    detail6Tray4IsUse,
    detail7Hour,
    detail7Minute,
    detail7Matter,
    detail7IsUse,
    detail7Tray1IsUse,
    detail7Tray2IsUse,
    detail7Tray3IsUse,
    detail7Tray4IsUse,
    detail8Hour,
    detail8Minute,
    detail8Matter,
    detail8IsUse,
    detail8Tray1IsUse,
    detail8Tray2IsUse,
    detail8Tray3IsUse,
    detail8Tray4IsUse,
    detail9Hour,
    detail9Minute,
    detail9Matter,
    detail9IsUse,
    detail9Tray1IsUse,
    detail9Tray2IsUse,
    detail9Tray3IsUse,
    detail9Tray4IsUse,
    detail10Hour,
    detail10Minute,
    detail10Matter,
    detail10IsUse,
    detail10Tray1IsUse,
    detail10Tray2IsUse,
    detail10Tray3IsUse,
    detail10Tray4IsUse,
    detail11Hour,
    detail11Minute,
    detail11Matter,
    detail11IsUse,
    detail11Tray1IsUse,
    detail11Tray2IsUse,
    detail11Tray3IsUse,
    detail11Tray4IsUse,
    detail12Hour,
    detail12Minute,
    detail12Matter,
    detail12IsUse,
    detail12Tray1IsUse,
    detail12Tray2IsUse,
    detail12Tray3IsUse,
    detail12Tray4IsUse,
    detail13Hour,
    detail13Minute,
    detail13Matter,
    detail13IsUse,
    detail13Tray1IsUse,
    detail13Tray2IsUse,
    detail13Tray3IsUse,
    detail13Tray4IsUse,
    detail14Hour,
    detail14Minute,
    detail14Matter,
    detail14IsUse,
    detail14Tray1IsUse,
    detail14Tray2IsUse,
    detail14Tray3IsUse,
    detail14Tray4IsUse,
    detail15Hour,
    detail15Minute,
    detail15Matter,
    detail15IsUse,
    detail15Tray1IsUse,
    detail15Tray2IsUse,
    detail15Tray3IsUse,
    detail15Tray4IsUse,
    detail16Hour,
    detail16Minute,
    detail16Matter,
    detail16IsUse,
    detail16Tray1IsUse,
    detail16Tray2IsUse,
    detail16Tray3IsUse,
    detail16Tray4IsUse,
    detail17Hour,
    detail17Minute,
    detail17Matter,
    detail17IsUse,
    detail17Tray1IsUse,
    detail17Tray2IsUse,
    detail17Tray3IsUse,
    detail17Tray4IsUse,
    detail18Hour,
    detail18Minute,
    detail18Matter,
    detail18IsUse,
    detail18Tray1IsUse,
    detail18Tray2IsUse,
    detail18Tray3IsUse,
    detail18Tray4IsUse,
    detail19Hour,
    detail19Minute,
    detail19Matter,
    detail19IsUse,
    detail19Tray1IsUse,
    detail19Tray2IsUse,
    detail19Tray3IsUse,
    detail19Tray4IsUse,
    detail20Hour,
    detail20Minute,
    detail20Matter,
    detail20IsUse,
    detail20Tray1IsUse,
    detail20Tray2IsUse,
    detail20Tray3IsUse,
    detail20Tray4IsUse,
    detail21Hour,
    detail21Minute,
    detail21Matter,
    detail21IsUse,
    detail21Tray1IsUse,
    detail21Tray2IsUse,
    detail21Tray3IsUse,
    detail21Tray4IsUse,
    detail22Hour,
    detail22Minute,
    detail22Matter,
    detail22IsUse,
    detail22Tray1IsUse,
    detail22Tray2IsUse,
    detail22Tray3IsUse,
    detail22Tray4IsUse,
    detail23Hour,
    detail23Minute,
    detail23Matter,
    detail23IsUse,
    detail23Tray1IsUse,
    detail23Tray2IsUse,
    detail23Tray3IsUse,
    detail23Tray4IsUse,
    detailTray1SupplySettingMinute,
    detailTray1SupplySettingSecond,
    detailTray2SupplySettingMinute,
    detailTray2SupplySettingSecond,
    detailTray3SupplySettingMinute,
    detailTray3SupplySettingSecond,
    detailTray4SupplySettingMinute,
    detailTray4SupplySettingSecond,
    tray1EcSetting,
    tray2EcSetting,
    tray3EcSetting,
    tray4EcSetting,
    tray1PhSetting,
    tray2PhSetting,
    tray3PhSetting,
    tray4PhSetting,
  } = body;

  const list = [
    detail1Matter,
    detail2Matter,
    detail3Matter,
    detail4Matter,
    detail5Matter,
    detail6Matter,
    detail7Matter,
    detail8Matter,
    detail9Matter,
    detail10Matter,
    detail11Matter,
    detail12Matter,
    detail13Matter,
    detail14Matter,
    detail15Matter,
    detail16Matter,
    detail17Matter,
    detail18Matter,
    detail19Matter,
    detail20Matter,
    detail21Matter,
    detail22Matter,
    detail23Matter,
    detail1IsUse,
    detail2IsUse,
    detail3IsUse,
    detail4IsUse,
    detail5IsUse,
    detail6IsUse,
    detail7IsUse,
    detail8IsUse,
    detail9IsUse,
    detail10IsUse,
    detail11IsUse,
    detail12IsUse,
    detail13IsUse,
    detail14IsUse,
    detail15IsUse,
    detail16IsUse,
    detail17IsUse,
    detail18IsUse,
    detail19IsUse,
    detail20IsUse,
    detail21IsUse,
    detail22IsUse,
    detail23IsUse,
    detail1Tray1IsUse,
    detail2Tray1IsUse,
    detail3Tray1IsUse,
    detail4Tray1IsUse,
    detail5Tray1IsUse,
    detail6Tray1IsUse,
    detail7Tray1IsUse,
    detail8Tray1IsUse,
    detail9Tray1IsUse,
    detail10Tray1IsUse,
    detail11Tray1IsUse,
    detail12Tray1IsUse,
    detail13Tray1IsUse,
    detail14Tray1IsUse,
    detail15Tray1IsUse,
    detail16Tray1IsUse,
    detail17Tray1IsUse,
    detail18Tray1IsUse,
    detail19Tray1IsUse,
    detail20Tray1IsUse,
    detail21Tray1IsUse,
    detail22Tray1IsUse,
    detail23Tray1IsUse,
    detail1Tray2IsUse,
    detail2Tray2IsUse,
    detail3Tray2IsUse,
    detail4Tray2IsUse,
    detail5Tray2IsUse,
    detail6Tray2IsUse,
    detail7Tray2IsUse,
    detail8Tray2IsUse,
    detail9Tray2IsUse,
    detail10Tray2IsUse,
    detail11Tray2IsUse,
    detail12Tray2IsUse,
    detail13Tray2IsUse,
    detail14Tray2IsUse,
    detail15Tray2IsUse,
    detail16Tray2IsUse,
    detail17Tray2IsUse,
    detail18Tray2IsUse,
    detail19Tray2IsUse,
    detail20Tray2IsUse,
    detail21Tray2IsUse,
    detail22Tray2IsUse,
    detail23Tray2IsUse,
    detail1Tray3IsUse,
    detail2Tray3IsUse,
    detail3Tray3IsUse,
    detail4Tray3IsUse,
    detail5Tray3IsUse,
    detail6Tray3IsUse,
    detail7Tray3IsUse,
    detail8Tray3IsUse,
    detail9Tray3IsUse,
    detail10Tray3IsUse,
    detail11Tray3IsUse,
    detail12Tray3IsUse,
    detail13Tray3IsUse,
    detail14Tray3IsUse,
    detail15Tray3IsUse,
    detail16Tray3IsUse,
    detail17Tray3IsUse,
    detail18Tray3IsUse,
    detail19Tray3IsUse,
    detail20Tray3IsUse,
    detail21Tray3IsUse,
    detail22Tray3IsUse,
    detail23Tray3IsUse,
    detail1Tray4IsUse,
    detail2Tray4IsUse,
    detail3Tray4IsUse,
    detail4Tray4IsUse,
    detail5Tray4IsUse,
    detail6Tray4IsUse,
    detail7Tray4IsUse,
    detail8Tray4IsUse,
    detail9Tray4IsUse,
    detail10Tray4IsUse,
    detail11Tray4IsUse,
    detail12Tray4IsUse,
    detail13Tray4IsUse,
    detail14Tray4IsUse,
    detail15Tray4IsUse,
    detail16Tray4IsUse,
    detail17Tray4IsUse,
    detail18Tray4IsUse,
    detail19Tray4IsUse,
    detail20Tray4IsUse,
    detail21Tray4IsUse,
    detail22Tray4IsUse,
    detail23Tray4IsUse,
  ];

  const validString = ["0", "1", ""];
  if (
    Number(detail1Minute) < 0 ||
    Number(detail1Minute) > 59 ||
    Number(detail2Minute) < 0 ||
    Number(detail2Minute) > 59 ||
    Number(detail3Minute) < 0 ||
    Number(detail3Minute) > 59 ||
    Number(detail4Minute) < 0 ||
    Number(detail4Minute) > 59 ||
    Number(detail5Minute) < 0 ||
    Number(detail5Minute) > 59 ||
    Number(detail6Minute) < 0 ||
    Number(detail6Minute) > 59 ||
    Number(detail7Minute) < 0 ||
    Number(detail7Minute) > 59 ||
    Number(detail8Minute) < 0 ||
    Number(detail8Minute) > 59 ||
    Number(detail9Minute) < 0 ||
    Number(detail9Minute) > 59 ||
    Number(detail10Minute) < 0 ||
    Number(detail10Minute) > 59 ||
    Number(detail11Minute) < 0 ||
    Number(detail11Minute) > 59 ||
    Number(detail12Minute) < 0 ||
    Number(detail12Minute) > 59 ||
    Number(detail13Minute) < 0 ||
    Number(detail13Minute) > 59 ||
    Number(detail14Minute) < 0 ||
    Number(detail14Minute) > 59 ||
    Number(detail15Minute) < 0 ||
    Number(detail15Minute) > 59 ||
    Number(detail16Minute) < 0 ||
    Number(detail16Minute) > 59 ||
    Number(detail17Minute) < 0 ||
    Number(detail17Minute) > 59 ||
    Number(detail18Minute) < 0 ||
    Number(detail18Minute) > 59 ||
    Number(detail19Minute) < 0 ||
    Number(detail19Minute) > 59 ||
    Number(detail20Minute) < 0 ||
    Number(detail20Minute) > 59 ||
    Number(detail21Minute) < 0 ||
    Number(detail21Minute) > 59 ||
    Number(detail22Minute) < 0 ||
    Number(detail22Minute) > 59 ||
    Number(detail23Minute) < 0 ||
    Number(detail23Minute) > 59 ||
    Number(detail1Hour) < 0 ||
    Number(detail1Hour) > 23 ||
    Number(detail2Hour) < 0 ||
    Number(detail2Hour) > 23 ||
    Number(detail3Hour) < 0 ||
    Number(detail3Hour) > 23 ||
    Number(detail4Hour) < 0 ||
    Number(detail4Hour) > 23 ||
    Number(detail5Hour) < 0 ||
    Number(detail5Hour) > 23 ||
    Number(detail6Hour) < 0 ||
    Number(detail6Hour) > 23 ||
    Number(detail7Hour) < 0 ||
    Number(detail7Hour) > 23 ||
    Number(detail8Hour) < 0 ||
    Number(detail8Hour) > 23 ||
    Number(detail9Hour) < 0 ||
    Number(detail9Hour) > 23 ||
    Number(detail10Hour) < 0 ||
    Number(detail10Hour) > 23 ||
    Number(detail11Hour) < 0 ||
    Number(detail11Hour) > 23 ||
    Number(detail12Hour) < 0 ||
    Number(detail12Hour) > 23 ||
    Number(detail13Hour) < 0 ||
    Number(detail13Hour) > 23 ||
    Number(detail14Hour) < 0 ||
    Number(detail14Hour) > 23 ||
    Number(detail15Hour) < 0 ||
    Number(detail15Hour) > 23 ||
    Number(detail16Hour) < 0 ||
    Number(detail16Hour) > 23 ||
    Number(detail17Hour) < 0 ||
    Number(detail17Hour) > 23 ||
    Number(detail18Hour) < 0 ||
    Number(detail18Hour) > 23 ||
    Number(detail19Hour) < 0 ||
    Number(detail19Hour) > 23 ||
    Number(detail20Hour) < 0 ||
    Number(detail20Hour) > 23 ||
    Number(detail21Hour) < 0 ||
    Number(detail21Hour) > 23 ||
    Number(detail22Hour) < 0 ||
    Number(detail22Hour) > 23 ||
    Number(detail23Hour) < 0 ||
    Number(detail23Hour) > 23 ||
    Number(detailTray1SupplySettingMinute) < 0 ||
    Number(detailTray1SupplySettingMinute) > 99 ||
    Number(detailTray2SupplySettingMinute) < 0 ||
    Number(detailTray2SupplySettingMinute) > 99 ||
    Number(detailTray3SupplySettingMinute) < 0 ||
    Number(detailTray3SupplySettingMinute) > 99 ||
    Number(detailTray4SupplySettingMinute) < 0 ||
    Number(detailTray4SupplySettingMinute) > 99 ||
    Number(detailTray1SupplySettingSecond) < 0 ||
    Number(detailTray1SupplySettingSecond) > 59 ||
    Number(detailTray2SupplySettingSecond) < 0 ||
    Number(detailTray2SupplySettingSecond) > 59 ||
    Number(detailTray3SupplySettingSecond) < 0 ||
    Number(detailTray3SupplySettingSecond) > 59 ||
    Number(detailTray4SupplySettingSecond) < 0 ||
    Number(detailTray4SupplySettingSecond) > 59 ||
    Number(tray1EcSetting) < 0 ||
    Number(tray1EcSetting) > 5 ||
    Number(tray2EcSetting) < 0 ||
    Number(tray2EcSetting) > 5 ||
    Number(tray3EcSetting) < 0 ||
    Number(tray3EcSetting) > 5 ||
    Number(tray4EcSetting) < 0 ||
    Number(tray4EcSetting) > 5 ||
    Number(tray1PhSetting) < 0 ||
    Number(tray1PhSetting) > 14 ||
    Number(tray2PhSetting) < 0 ||
    Number(tray2PhSetting) > 14 ||
    Number(tray3PhSetting) < 0 ||
    Number(tray3PhSetting) > 14 ||
    Number(tray4PhSetting) < 0 ||
    Number(tray4PhSetting) > 14
  ) {
    return true;
  }

  for (let i of list) {
    if (!validString.includes(i)) {
      return true;
    }
  }

  return false;
}

module.exports = {
  filteringDetailSettingData,
  invalidDetailSettingData,
};
