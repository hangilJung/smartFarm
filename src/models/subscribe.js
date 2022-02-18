module.exports = () => {
  const mqClient = require("../utils/mqClient");
  const { dataExtraction } = require("../lib/fn");
  const socket = require("../utils/io");
  const mqTopic = ["sooin/test", "abc/def", "sooin", "sooin/test/env"];
  const DataAccess = require("./DataAccess");

  mqClient.subscribe(mqTopic, () => {
    mqClient.on("message", async (topic, data) => {
      if (topic == "sooin/test") {
        console.log(topic);
        console.log(JSON.parse(data.toString()));
      } else if (topic == "sooin/abc") {
        console.log(topic);
      } else if (topic == "sooin") {
        console.log("sooin");
        console.log(JSON.parse(data.toString()));
      } else if (topic == "abc/def") {
        console.log(topic);
      } else if (topic == "sooin/test/env") {
        const dataAccess = new DataAccess(data);
        const result = await dataAccess.saveSensorData();
        console.log(result);
        if (result === "success") {
          socket.emit("sensorDataFromLocal", dataExtraction(data));
        }
      }
    });
  });
};
