module.exports = () => {
  const app = require("../app");
  const PORT = process.env.SERVER_PORT;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API 서버 가동 ${PORT}`);
  });
};
