module.exports = {
  apps: [
    {
      name: "LOCAL",
      script: "./bin/www.js",
      instances: 1,
      exec_mode: "cluster",
    },
  ],
};
