const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mqClient = require("./src/models/subscribe");
const morgan = require("morgan");

dotenv.config();

mqClient();

const index = require("./src/routes");

app.use(express.json());
app.use(morgan("dev"));

app.use("/", index);

module.exports = app;
