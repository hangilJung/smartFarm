const jwt = require("jsonwebtoken");
const headerStatusCode = require("../utils/headerStatusCode");

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

module.exports = {
  verifyToken,
};
