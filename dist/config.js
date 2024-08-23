"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var _dotenv = require("dotenv");
// Import dotenv. If you don't want to show ur config values to connect to the database, you can use dotenv to hide them.
// You use the file .env to define private values

(0, _dotenv.config)();

// Use the process.env object to get the values from the .env file and connect to the database
var config = exports.config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "footmatch",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};