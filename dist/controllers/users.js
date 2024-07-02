"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateToken = exports.updateUser = exports.loginUser = exports.getUsersCount = exports.getUsers = exports.getUserByUsername = exports.getUserByEmail = exports.getUser = exports.findUserByUsername = exports.findUserByEmail = exports.deleteUser = exports.createUser = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _database = require("../database");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } // Answer to a url from app
var jwt = require("jsonwebtoken");

// Global variable
var SECRET_KEY = process.env.SECRET_KEY;

///////////////////////////////////////////////////////////////////
// USERS FUNCTIONS
///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
// Function to get all the users
//
var getUsers = exports.getUsers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var connection, _yield$connection$que, _yield$connection$que2, users;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _database.connect)();
        case 2:
          connection = _context.sent;
          _context.next = 5;
          return connection.query("SELECT * FROM users");
        case 5:
          _yield$connection$que = _context.sent;
          _yield$connection$que2 = (0, _slicedToArray2["default"])(_yield$connection$que, 1);
          users = _yield$connection$que2[0];
          // Send the response
          res.json(users);
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getUsers(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to get one user by id
//
var getUser = exports.getUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var connection, _yield$connection$que3, _yield$connection$que4, user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _database.connect)();
        case 2:
          connection = _context2.sent;
          _context2.next = 5;
          return connection.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
        case 5:
          _yield$connection$que3 = _context2.sent;
          _yield$connection$que4 = (0, _slicedToArray2["default"])(_yield$connection$que3, 1);
          user = _yield$connection$que4[0];
          if (!(user.length === 0)) {
            _context2.next = 12;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            message: "User not found"
          }));
        case 12:
          // Send the response
          res.json(user[0]);
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getUser(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to get one user by username
//
var getUserByUsername = exports.getUserByUsername = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var connection, _yield$connection$que5, _yield$connection$que6, user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _database.connect)();
        case 2:
          connection = _context3.sent;
          _context3.next = 5;
          return connection.query("SELECT * FROM users WHERE username = ?", [req.params.username]);
        case 5:
          _yield$connection$que5 = _context3.sent;
          _yield$connection$que6 = (0, _slicedToArray2["default"])(_yield$connection$que5, 1);
          user = _yield$connection$que6[0];
          if (!(user.length === 0)) {
            _context3.next = 12;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            message: "User not found"
          }));
        case 12:
          // Send the response
          res.json(user[0]);
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getUserByUsername(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to get one user by email
//
var getUserByEmail = exports.getUserByEmail = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var connection, _yield$connection$que7, _yield$connection$que8, user;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _database.connect)();
        case 2:
          connection = _context4.sent;
          _context4.next = 5;
          return connection.query("SELECT * FROM users WHERE email= ?", [req.params.email]);
        case 5:
          _yield$connection$que7 = _context4.sent;
          _yield$connection$que8 = (0, _slicedToArray2["default"])(_yield$connection$que7, 1);
          user = _yield$connection$que8[0];
          if (!(user.length === 0)) {
            _context4.next = 12;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: "User not found"
          }));
        case 12:
          // Send the response
          res.json(user[0]);
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getUserByEmail(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to get the number of users
//
var getUsersCount = exports.getUsersCount = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var connection, _yield$connection$que9, _yield$connection$que10, numUsers;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return (0, _database.connect)();
        case 2:
          connection = _context5.sent;
          _context5.next = 5;
          return connection.query("SELECT count(*) FROM users");
        case 5:
          _yield$connection$que9 = _context5.sent;
          _yield$connection$que10 = (0, _slicedToArray2["default"])(_yield$connection$que9, 1);
          numUsers = _yield$connection$que10[0];
          // Send the response
          res.json(numUsers[0]["count(*)"]);
        case 9:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function getUsersCount(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// FUNCIONES PARA CREATEUSER
/////////////////////////////
var findUserByUsername = exports.findUserByUsername = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(username, connection) {
    var _yield$connection$que11, _yield$connection$que12, users;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return connection.query("SELECT * FROM users WHERE username = ?", [username]);
        case 2:
          _yield$connection$que11 = _context6.sent;
          _yield$connection$que12 = (0, _slicedToArray2["default"])(_yield$connection$que11, 1);
          users = _yield$connection$que12[0];
          return _context6.abrupt("return", users);
        case 6:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function findUserByUsername(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var findUserByEmail = exports.findUserByEmail = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(email, connection) {
    var _yield$connection$que13, _yield$connection$que14, users;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return connection.query("SELECT * FROM users WHERE email = ?", [email]);
        case 2:
          _yield$connection$que13 = _context7.sent;
          _yield$connection$que14 = (0, _slicedToArray2["default"])(_yield$connection$que13, 1);
          users = _yield$connection$que14[0];
          return _context7.abrupt("return", users);
        case 6:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function findUserByEmail(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to create a user
var createUser = exports.createUser = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var connection, usersByUsername, usersByEmail, _yield$connection$que15, _yield$connection$que16, results, newToken;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return (0, _database.connect)();
        case 3:
          connection = _context8.sent;
          _context8.next = 6;
          return findUserByUsername(req.body.username, connection);
        case 6:
          usersByUsername = _context8.sent;
          if (!(usersByUsername.length > 0)) {
            _context8.next = 9;
            break;
          }
          return _context8.abrupt("return", res.status(409).json({
            message: "Username already in use."
          }));
        case 9:
          _context8.next = 11;
          return findUserByEmail(req.body.email, connection);
        case 11:
          usersByEmail = _context8.sent;
          if (!(usersByEmail.length > 0)) {
            _context8.next = 14;
            break;
          }
          return _context8.abrupt("return", res.status(409).json({
            message: "Email already in use."
          }));
        case 14:
          _context8.next = 16;
          return connection.query("INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)", [req.body.name, req.body.email, req.body.username, req.body.password]);
        case 16:
          _yield$connection$que15 = _context8.sent;
          _yield$connection$que16 = (0, _slicedToArray2["default"])(_yield$connection$que15, 1);
          results = _yield$connection$que16[0];
          // Generate a token
          newToken = jwt.sign({
            id: results.insertId
          }, SECRET_KEY, {
            expiresIn: 86400
          }); // 24 hours
          // Successful response
          res.json({
            id: results.insertId,
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            token: newToken
          });
          _context8.next = 27;
          break;
        case 23:
          _context8.prev = 23;
          _context8.t0 = _context8["catch"](0);
          console.error("Error creating user:", _context8.t0);
          res.status(500).json({
            message: "Error creating user."
          });
        case 27:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 23]]);
  }));
  return function createUser(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to delete a user
//
var deleteUser = exports.deleteUser = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var connection;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return (0, _database.connect)();
        case 2:
          connection = _context9.sent;
          _context9.next = 5;
          return connection.query("DELETE FROM users WHERE id = ?", [req.params.id]);
        case 5:
          // Send status
          res.sendStatus(204);
        case 6:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function deleteUser(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to update a user
//
var updateUser = exports.updateUser = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var connection, result;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return (0, _database.connect)();
        case 2:
          connection = _context10.sent;
          _context10.next = 5;
          return connection.query("UPDATE users SET ? WHERE id = ?", [req.body, req.params.id]);
        case 5:
          result = _context10.sent;
          // Send the info of the new user
          res.json(_objectSpread(_objectSpread({}, req.body), {}, {
            id: req.params.id
          }));
        case 7:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function updateUser(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to login a user
//
var loginUser = exports.loginUser = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var connection, _yield$connection$que17, _yield$connection$que18, rows, user, token;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return (0, _database.connect)();
        case 2:
          connection = _context11.sent;
          _context11.next = 5;
          return connection.query("SELECT * FROM users WHERE username = ? AND password = ?", [req.body.username, req.body.password]);
        case 5:
          _yield$connection$que17 = _context11.sent;
          _yield$connection$que18 = (0, _slicedToArray2["default"])(_yield$connection$que17, 1);
          rows = _yield$connection$que18[0];
          user = rows[0]; // Check if the user exists
          if (!(user.length == 0)) {
            _context11.next = 13;
            break;
          }
          return _context11.abrupt("return", res.status(404).json({
            message: "User not found"
          }));
        case 13:
          // Generate a token
          token = jwt.sign({
            id: user.id
          }, SECRET_KEY, {
            expiresIn: 86400
          }); // 24 hours
          // Remove the password from the user object before sending the response
          delete user.password;

          // Send the response
          res.json(_objectSpread(_objectSpread({}, user), {}, {
            token: token
          }));
        case 16:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function loginUser(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

// Validation token
var validateToken = exports.validateToken = function validateToken(req, res) {
  var token = req.body.token;
  console.log("hola");
  if (!token) {
    return res.status(403).json({
      message: "No token provided"
    });
  }
  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    if (err) {
      return res.status(500).json({
        message: "Failed to authenticate token"
      });
    }
    // If everything is good, response with the user id
    res.status(200).json({
      message: "Token is valid",
      userId: decoded.id
    });
  });
};