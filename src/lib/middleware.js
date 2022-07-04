const jwt = require("jsonwebtoken");
const headerStatusCode = require("../utils/headerStatusCode");
const logger = require("../config/logger");

const verifyToken = (req, res, next) => {
  let response = {
    header: {},
  };
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

    return next();
  } catch (error) {
    // logger.error("verifyToken error message:", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json((response.header = headerStatusCode.tokenExpiredError));
    }
    response.header = headerStatusCode.invalidToken;

    return res.status(400).json(response);
  }
};

const ipAndUrl = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logger.debug(`access IP ${ip} / url ${req.url}`);
  next();
};

const wrongApproch = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  let response = {
    header: {},
  };

  console.log(`접속 아이피 : ${ip}`);
  logger.debug(`wrong access ${ip}  Url ${req.url}`);
  response.header = headerStatusCode.httpError;
  response.header.receiveMethodAndUrl = `${req.method} ${req.url}`;

  res.json(response);
};

module.exports = {
  verifyToken,
  ipAndUrl,
  wrongApproch,
};
