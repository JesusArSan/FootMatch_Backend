"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _morgan = _interopRequireDefault(require("morgan"));
var _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _swaggerOptions = require("./swaggerOptions");
var _users = _interopRequireDefault(require("./routes/users"));
// Express configuration

var specs = (0, _swaggerJsdoc["default"])(_swaggerOptions.options); // Swagger options

var app = (0, _express["default"])();
app.use((0, _cors["default"])()); // Allow the app to connect to the server
app.use((0, _morgan["default"])("dev")); // Show the requests in the console
app.use(_express["default"].json()); // Allow the app to understand JSON

// UserRoutes from the file routes/users.js. The app can visit the routes defined in the file users.js ONLY
app.use(_users["default"]);

// Swagger. Documents the routes
app.use("/docs", _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(specs));
var _default = exports["default"] = app;