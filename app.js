const express = require("express");
const app = express();
const dotenv = require("dotenv");
// const mqClient = require("./src/models/subscribe");
const morgan = require("morgan");
const ioEmit = require("./src/utils/ioEmit");
const headerStatusCode = require("./src/utils/headerStatusCode");
const moment = require("moment");

dotenv.config();

// mqClient();
ioEmit();

const index = require("./src/routes");

app.use(express.json());
app.use(morgan("dev"));

app.use(
  "/",
  (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const accessTime = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log(`${ip} ${accessTime}`);
    next();
  },
  index
);

app.use((req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const accessTime = moment().format("YYYY-MM-DD HH:mm:ss");
  let response = {
    header: {},
  };

  response.header = headerStatusCode.httpError;
  response.header.receiveMethodAndUrl = `${req.method} ${req.url}`;

  console.log(
    `${ip} ${JSON.stringify(response.header.receiveMethodAndUrl)} ${accessTime}`
  );
  res.json(response);
});

module.exports = app;
