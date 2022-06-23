module.exports = {
  apps: [
    {
      name: "LOCAL",
      script: "./bin/www.js",
      instances: 2,
      exec_mode: "cluster",
    },
  ],
};
