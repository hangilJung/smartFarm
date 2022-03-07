const DataAccess = require("./DataAccess");
const headerStatusCode = require("../utils/headerStatusCode.js");

class Login {
  constructor(body) {
    this.body = body;
  }

  async login() {
    const { user_id, user_pw } = this.body;

    let response = {
      header: {},
    };

    try {
      const result = await DataAccess.login(user_id, user_pw);

      if (result[0].length > 0 && result[0][0]) {
        response.header = headerStatusCode.normalService;
      } else {
        response.header = headerStatusCode.invalidRequestParameterError;
      }

      return response;
    } catch (error) {
      console.log(error);
      response.header = headerStatusCode.invalidRequestParameterError;

      return response;
    }
  }
}

module.exports = Login;
