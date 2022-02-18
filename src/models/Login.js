const DataAccess = require("./DataAccess");
const headerErrorCode = require("../utils/headerErrorCode");

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
        response.header = headerErrorCode.normalService;
      } else {
        response.header = headerErrorCode.invalidRequestParameterError;
      }

      return response;
    } catch (error) {
      console.log(error);
      response.header = headerErrorCode.invalidRequestParameterError;

      return response;
    }
  }
}

module.exports = Login;
