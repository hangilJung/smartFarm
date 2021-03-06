const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const ioEmit = require("./src/utils/ioEmit");
const { wrongApproch } = require("./src/lib/middleware");
const helmet = require("helmet");
const hpp = require("hpp");
const detect = require("./src/utils/detect");

dotenv.config();

ioEmit();
detect();

const index = require("./src/routes");

app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}

app.use("/", index);

app.use(wrongApproch);

module.exports = app;
