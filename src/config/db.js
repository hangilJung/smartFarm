const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
let nodeEnv;

dotenv.config();

const commonKeyAndValue = {
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
  dateStrings: "date",
};

if (process.env.NODE_ENV === "dev") {
  nodeEnv = {
    host: process.env.MYSQL_DEV_HOST,
    user: process.env.MYSQL_DEV_USER,
    password: process.env.MYSQL_DEV_PASSWORD,
    database: process.env.MYSQL_DEV_DATABASE,
    ...commonKeyAndValue,
  };
} else if (process.env.NODE_ENV === "test") {
  nodeEnv = {
    host: process.env.MYSQL_TEST_HOST,
    user: process.env.MYSQL_TEST_USER,
    password: process.env.MYSQL_TEST_PASSWORD,
    database: process.env.MYSQL_TEST_DATABASE,
    ...commonKeyAndValue,
  };
} else if (process.env.NODE_ENV === "production") {
  nodeEnv = {
    host: process.env.MYSQL_PROD_HOST,
    user: process.env.MYSQL_PROD_USER,
    password: process.env.MYSQL_PROD_PASSWORD,
    database: process.env.MYSQL_PROD_DATABASE,
    ...commonKeyAndValue,
  };
}

const pool = mysql.createPool(nodeEnv);

module.exports = pool;
