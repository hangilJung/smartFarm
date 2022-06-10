const {
  invalidInsideMainSensorData,
  invalidOutsideMainSensorData,
} = require("../src/lib/fn");

const list = [
  {
    sensor_name: "inHumi",
    sensor_data_value: "25.10",
    sensor_data_created_at: "2022-06-09 15:34:00",
  },
  {
    sensor_name: "inInsol",
    sensor_data_value: "60.00",
    sensor_data_created_at: "2022-06-09 15:34:00",
  },
  {
    sensor_name: "co2",
    sensor_data_value: "443.00",
    sensor_data_created_at: "2022-06-09 15:34:00",
  },
];

const resultList = [
  {
    sensor_name: "inTemp",
    sensor_data_value: null,
    sensor_data_created_at: "2022-06-09 15:34:00",
  },
  {
    sensor_name: "inHumi",
    sensor_data_value: "25.10",
    sensor_data_created_at: "2022-06-09 15:34:00",
  },
  {
    sensor_name: "inInsol",
    sensor_data_value: "60.00",
    sensor_data_created_at: "2022-06-09 15:34:00",
  },
  {
    sensor_name: "co2",
    sensor_data_value: "443.00",
    sensor_data_created_at: "2022-06-09 15:34:00",
  },
];

test("invalidInsideMainSensorData / null값이 들어가면 null값으로 출력", () => {
  expect(invalidInsideMainSensorData(list)).toStrictEqual(resultList);
});

const receiveOutsideMainSensorDataList = [
  {
    sensor_name: "outTemp",
    sensor_data_value: "23.80",
    sensor_data_created_at: "2022-06-09 18:18:01",
  },
  {
    sensor_name: "outInsol",
    sensor_data_value: "91.00",
    sensor_data_created_at: "2022-06-09 18:18:01",
  },
  {
    sensor_name: "ws",
    sensor_data_value: "0.00",
    sensor_data_created_at: "2022-06-09 18:18:01",
  },
];

const existingOutsideMainSensorDataList = [
  {
    sensor_name: "outTemp",
    sensor_data_value: "23.80",
    sensor_data_created_at: "2022-06-09 18:18:01",
  },
  {
    sensor_name: "outHumi",
    sensor_data_value: null,
    sensor_data_created_at: "2022-06-09 18:18:01",
  },
  {
    sensor_name: "rf",
    sensor_data_value: null,
    sensor_data_created_at: "2022-06-09 18:18:01",
  },
  {
    sensor_name: "outInsol",
    sensor_data_value: "91.00",
    sensor_data_created_at: "2022-06-09 18:18:01",
  },
  {
    sensor_name: "ws",
    sensor_data_value: "0.00",
    sensor_data_created_at: "2022-06-09 18:18:01",
  },
];

test("invalidOutsideMainSensorData / null값이 들어가면 null값으로 출력", () => {
  expect(
    invalidOutsideMainSensorData(receiveOutsideMainSensorDataList)
  ).toStrictEqual(existingOutsideMainSensorDataList);
});

test("invalidOutsideMainSensorData / 빈 배열[] 입력", () => {
  expect().toStrictEqual();
});
