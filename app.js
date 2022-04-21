const express = require("express");
const app = express();
const dotenv = require("dotenv");
// const mqClient = require("./src/models/subscribe");
const morgan = require("morgan");
const ioEmit = require("./src/utils/ioEmit");
const headerStatusCode = require("./src/utils/headerStatusCode");
const moment = require("moment");
const { wrongApproch } = require("./src/lib/middleware");

dotenv.config();

// mqClient();
ioEmit();

const index = require("./src/routes");

app.use(express.json());
app.use(morgan("dev"));

app.use("/", index);

app.use(wrongApproch);

module.exports = app;
