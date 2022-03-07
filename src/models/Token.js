const jwt = require("jsonwebtoken");
const moment = require("moment");
const headerStatusCode = require("../utils/headerStatusCode");

class Token {
  constructor(authorization) {
    this.auth = authorization;
  }

  tokenIssue() {
    let response = {
      header: {},
    };
    if (process.env.ACCESS_SERVER_SECRET_KEY === this.auth) {
      const accessToken = jwt.sign(
        {
          expires_at: moment().add(2, "h").format("YYYY-MM-DD HH:mm:ss"),
          issued_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1m",
          issuer: "coporation sooin",
        }
      );

      response.header = headerStatusCode.tokenIssuanceSuccess;
      response.body = { token: accessToken };

      return response;
    } else {
      response.header = headerStatusCode.notAllowKey;

      return response;
    }
  }
}

module.exports = Token;
