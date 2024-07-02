"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _app = _interopRequireDefault(require("./app"));
require("./database");
// Server listen on port 3000
_app["default"].listen(3000);
console.log("Server on port 3000");