"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateToken = exports.updateUser = exports.sendFriendRequest = exports.removeFriendRequest = exports.removeFriend = exports.loginUser = exports.isFriend = exports.getUsersCount = exports.getUsers = exports.getUserByUsername = exports.getUserByEmail = exports.getUser = exports.getFriends = exports.getFriendRequests = exports.getFriendRequestStatus = exports.deleteUser = exports.createUser = exports.acceptFriendRequest = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _database = require("../database");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
          _context.prev = 0;
          _context.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context.sent;
          _context.next = 6;
          return connection.query("SELECT * FROM users");
        case 6:
          _yield$connection$que = _context.sent;
          _yield$connection$que2 = (0, _slicedToArray2["default"])(_yield$connection$que, 1);
          users = _yield$connection$que2[0];
          // Send the response
          res.json(users);
          _context.next = 16;
          break;
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error("Error getting users:", _context.t0);
          res.status(500).json({
            message: "Error getting users."
          });
        case 16:
          _context.prev = 16;
          if (connection) connection.release(); // Release the connection
          return _context.finish(16);
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 12, 16, 19]]);
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
          _context2.prev = 0;
          _context2.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context2.sent;
          _context2.next = 6;
          return connection.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
        case 6:
          _yield$connection$que3 = _context2.sent;
          _yield$connection$que4 = (0, _slicedToArray2["default"])(_yield$connection$que3, 1);
          user = _yield$connection$que4[0];
          if (!(user.length === 0)) {
            _context2.next = 13;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            message: "User not found"
          }));
        case 13:
          // Send the response
          res.json(user[0]);
        case 14:
          _context2.next = 20;
          break;
        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          console.error("Error getting user:", _context2.t0);
          res.status(500).json({
            message: "Error getting user."
          });
        case 20:
          _context2.prev = 20;
          if (connection) connection.release(); // Release the connection
          return _context2.finish(20);
        case 23:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 16, 20, 23]]);
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
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context3.sent;
          _context3.next = 6;
          return connection.query("SELECT * FROM users WHERE username = ?", [req.params.username]);
        case 6:
          _yield$connection$que5 = _context3.sent;
          _yield$connection$que6 = (0, _slicedToArray2["default"])(_yield$connection$que5, 1);
          user = _yield$connection$que6[0];
          if (!(user.length === 0)) {
            _context3.next = 13;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            message: "User not found"
          }));
        case 13:
          // Send the response
          res.json(user[0]);
        case 14:
          _context3.next = 20;
          break;
        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](0);
          console.error("Error getting user by username:", _context3.t0);
          res.status(500).json({
            message: "Error getting user by username."
          });
        case 20:
          _context3.prev = 20;
          if (connection) connection.release(); // Release the connection
          return _context3.finish(20);
        case 23:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 16, 20, 23]]);
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
          _context4.prev = 0;
          _context4.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context4.sent;
          _context4.next = 6;
          return connection.query("SELECT * FROM users WHERE email= ?", [req.params.email]);
        case 6:
          _yield$connection$que7 = _context4.sent;
          _yield$connection$que8 = (0, _slicedToArray2["default"])(_yield$connection$que7, 1);
          user = _yield$connection$que8[0];
          if (!(user.length === 0)) {
            _context4.next = 13;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: "User not found"
          }));
        case 13:
          // Send the response
          res.json(user[0]);
        case 14:
          _context4.next = 20;
          break;
        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.error("Error getting user by email:", _context4.t0);
          res.status(500).json({
            message: "Error getting user by email."
          });
        case 20:
          _context4.prev = 20;
          if (connection) connection.release(); // Release the connection
          return _context4.finish(20);
        case 23:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 16, 20, 23]]);
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
          _context5.prev = 0;
          _context5.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context5.sent;
          _context5.next = 6;
          return connection.query("SELECT count(*) FROM users");
        case 6:
          _yield$connection$que9 = _context5.sent;
          _yield$connection$que10 = (0, _slicedToArray2["default"])(_yield$connection$que9, 1);
          numUsers = _yield$connection$que10[0];
          // Send the response
          res.json(numUsers[0]["count(*)"]);
          _context5.next = 16;
          break;
        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          console.error("Error getting users count:", _context5.t0);
          res.status(500).json({
            message: "Error getting users count."
          });
        case 16:
          _context5.prev = 16;
          if (connection) connection.release(); // Release the connection
          return _context5.finish(16);
        case 19:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 12, 16, 19]]);
  }));
  return function getUsersCount(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to create a user
//
var createUser = exports.createUser = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var connection, _yield$connection$que11, _yield$connection$que12, usersByUsername, _yield$connection$que13, _yield$connection$que14, usersByEmail, _yield$connection$que15, _yield$connection$que16, results, newToken;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context6.sent;
          _context6.next = 6;
          return connection.query("SELECT * FROM users WHERE username = ?", [req.body.username]);
        case 6:
          _yield$connection$que11 = _context6.sent;
          _yield$connection$que12 = (0, _slicedToArray2["default"])(_yield$connection$que11, 1);
          usersByUsername = _yield$connection$que12[0];
          if (!(usersByUsername.length > 0)) {
            _context6.next = 11;
            break;
          }
          return _context6.abrupt("return", res.status(409).json({
            message: "Username already in use."
          }));
        case 11:
          _context6.next = 13;
          return connection.query("SELECT * FROM users WHERE email = ?", [req.body.email]);
        case 13:
          _yield$connection$que13 = _context6.sent;
          _yield$connection$que14 = (0, _slicedToArray2["default"])(_yield$connection$que13, 1);
          usersByEmail = _yield$connection$que14[0];
          if (!(usersByEmail.length > 0)) {
            _context6.next = 18;
            break;
          }
          return _context6.abrupt("return", res.status(409).json({
            message: "Email already in use."
          }));
        case 18:
          _context6.next = 20;
          return connection.query("INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)", [req.body.name, req.body.email, req.body.username, req.body.password]);
        case 20:
          _yield$connection$que15 = _context6.sent;
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
          _context6.next = 31;
          break;
        case 27:
          _context6.prev = 27;
          _context6.t0 = _context6["catch"](0);
          console.error("Error creating user:", _context6.t0);
          res.status(500).json({
            message: "Error creating user."
          });
        case 31:
          _context6.prev = 31;
          if (connection) connection.release(); // Release the connection
          return _context6.finish(31);
        case 34:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 27, 31, 34]]);
  }));
  return function createUser(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to delete a user
//
var deleteUser = exports.deleteUser = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var connection;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context7.sent;
          _context7.next = 6;
          return connection.query("DELETE FROM users WHERE id = ?", [req.params.id]);
        case 6:
          // Send status
          res.sendStatus(204);
          _context7.next = 13;
          break;
        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          console.error("Error deleting user:", _context7.t0);
          res.status(500).json({
            message: "Error deleting user."
          });
        case 13:
          _context7.prev = 13;
          if (connection) connection.release(); // Release the connection
          return _context7.finish(13);
        case 16:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 9, 13, 16]]);
  }));
  return function deleteUser(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to update a user
//
var updateUser = exports.updateUser = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var connection, result;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context8.sent;
          _context8.next = 6;
          return connection.query("UPDATE users SET ? WHERE id = ?", [req.body, req.params.id]);
        case 6:
          result = _context8.sent;
          // Send the info of the new user
          res.json(_objectSpread(_objectSpread({}, req.body), {}, {
            id: req.params.id
          }));
          _context8.next = 14;
          break;
        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          console.error("Error updating user:", _context8.t0);
          res.status(500).json({
            message: "Error updating user."
          });
        case 14:
          _context8.prev = 14;
          if (connection) connection.release(); // Release the connection
          return _context8.finish(14);
        case 17:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 10, 14, 17]]);
  }));
  return function updateUser(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to login a user
//
var loginUser = exports.loginUser = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var connection, _yield$connection$que17, _yield$connection$que18, rows, user, token;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context9.sent;
          _context9.next = 6;
          return connection.query("SELECT * FROM users WHERE username = ? AND password = ?", [req.body.username, req.body.password]);
        case 6:
          _yield$connection$que17 = _context9.sent;
          _yield$connection$que18 = (0, _slicedToArray2["default"])(_yield$connection$que17, 1);
          rows = _yield$connection$que18[0];
          user = rows[0]; // Check if the user exists
          if (user) {
            _context9.next = 14;
            break;
          }
          return _context9.abrupt("return", res.status(404).json({
            message: "User not found"
          }));
        case 14:
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
        case 17:
          _context9.next = 23;
          break;
        case 19:
          _context9.prev = 19;
          _context9.t0 = _context9["catch"](0);
          console.error("Login error: ", _context9.t0);
          res.status(500).json({
            message: "Internal server error"
          });
        case 23:
          _context9.prev = 23;
          if (connection) connection.release(); // Release the connection
          return _context9.finish(23);
        case 26:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 19, 23, 26]]);
  }));
  return function loginUser(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to get friends of a user
//
var getFriends = exports.getFriends = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var connection, userId, _yield$connection$que19, _yield$connection$que20, friends;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context10.sent;
          // Get the user id from the request parameters
          userId = req.params.id; // Query to the database to get friends details
          _context10.next = 7;
          return connection.query("SELECT u.id, u.username, u.name, u.email, u.photo\n       FROM friends f\n       JOIN users u ON f.friend_id = u.id\n       WHERE f.user_id = ?", [userId]);
        case 7:
          _yield$connection$que19 = _context10.sent;
          _yield$connection$que20 = (0, _slicedToArray2["default"])(_yield$connection$que19, 1);
          friends = _yield$connection$que20[0];
          // Send the response
          res.json(friends);
          _context10.next = 17;
          break;
        case 13:
          _context10.prev = 13;
          _context10.t0 = _context10["catch"](0);
          console.error("Error getting friends:", _context10.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });
        case 17:
          _context10.prev = 17;
          if (connection) connection.release(); // Release the connection
          return _context10.finish(17);
        case 20:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 13, 17, 20]]);
  }));
  return function getFriends(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to verify if a user is friend of other
//
var isFriend = exports.isFriend = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var connection, userId, friendId, _yield$connection$que21, _yield$connection$que22, friends;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context11.sent;
          // Get the user id from the request parameters
          userId = req.body.userId;
          friendId = req.body.friendId;
          console.log("userId: ", userId);
          console.log("friendId: ", friendId);

          // Query to the database to get friends details
          _context11.next = 10;
          return connection.query("SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", [userId, friendId, friendId, userId]);
        case 10:
          _yield$connection$que21 = _context11.sent;
          _yield$connection$que22 = (0, _slicedToArray2["default"])(_yield$connection$que21, 1);
          friends = _yield$connection$que22[0];
          // Send the response
          res.json({
            isFriend: friends.length > 0
          });
          _context11.next = 20;
          break;
        case 16:
          _context11.prev = 16;
          _context11.t0 = _context11["catch"](0);
          console.error("Error getting friends:", _context11.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });
        case 20:
          _context11.prev = 20;
          if (connection) connection.release(); // Release the connection
          return _context11.finish(20);
        case 23:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 16, 20, 23]]);
  }));
  return function isFriend(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to get friend requests of a user
//
var getFriendRequests = exports.getFriendRequests = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var userId, connection, _yield$connection$que23, _yield$connection$que24, friendRequests;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          // Get the user id from the request
          userId = req.params.id;
          _context12.prev = 1;
          _context12.next = 4;
          return (0, _database.getConnection)();
        case 4:
          connection = _context12.sent;
          _context12.next = 7;
          return connection.query("SELECT fr.id, fr.sender_id, u.username, u.photo AS sender_photo, fr.status, fr.created_at \n\t\t\t\t\t\t\tFROM friend_requests fr \n\t\t\t\t\t\t\tJOIN users u \n\t\t\t\t\t\t\tON fr.sender_id = u.id \n\t\t\t\t\t\t\tWHERE fr.receiver_id = ? \n\t\t\t\t\t\t\tAND fr.status = 'pending'", [userId]);
        case 7:
          _yield$connection$que23 = _context12.sent;
          _yield$connection$que24 = (0, _slicedToArray2["default"])(_yield$connection$que23, 1);
          friendRequests = _yield$connection$que24[0];
          res.status(200).json(friendRequests);
          _context12.next = 17;
          break;
        case 13:
          _context12.prev = 13;
          _context12.t0 = _context12["catch"](1);
          console.error("Error getting friend requests:", _context12.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });
        case 17:
          _context12.prev = 17;
          if (connection) connection.release(); // Release the connection
          return _context12.finish(17);
        case 20:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[1, 13, 17, 20]]);
  }));
  return function getFriendRequests(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();

/////////////////////////////////////////////////////////////////////
// Function to send a friend request
//
var sendFriendRequest = exports.sendFriendRequest = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res) {
    var connection, _req$body, sender_id, receiver_id, _yield$connection$que25, _yield$connection$que26, existingRequest, _yield$connection$que27, _yield$connection$que28, existingRequest2, _yield$connection$que29, _yield$connection$que30, existingFriend;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context13.sent;
          _req$body = req.body, sender_id = _req$body.sender_id, receiver_id = _req$body.receiver_id; // Validate input data to avoid same  user as sender and receiver
          if (!(sender_id == receiver_id)) {
            _context13.next = 7;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            error: "Sender and receiver IDs cannot be the same."
          }));
        case 7:
          if (!(!sender_id || !receiver_id)) {
            _context13.next = 9;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            error: "Sender and receiver IDs are required."
          }));
        case 9:
          _context13.next = 11;
          return connection.query("SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ? \n       AND status = 'pending'", [sender_id, receiver_id]);
        case 11:
          _yield$connection$que25 = _context13.sent;
          _yield$connection$que26 = (0, _slicedToArray2["default"])(_yield$connection$que25, 1);
          existingRequest = _yield$connection$que26[0];
          if (!(existingRequest.length > 0)) {
            _context13.next = 16;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            error: "Friend request already sent."
          }));
        case 16:
          _context13.next = 18;
          return connection.query("SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ? \n\t\t AND status = 'pending'", [receiver_id, sender_id]);
        case 18:
          _yield$connection$que27 = _context13.sent;
          _yield$connection$que28 = (0, _slicedToArray2["default"])(_yield$connection$que27, 1);
          existingRequest2 = _yield$connection$que28[0];
          if (!(existingRequest2.length > 0)) {
            _context13.next = 27;
            break;
          }
          _context13.next = 24;
          return acceptFriendRequest({
            body: {
              requestId: existingRequest2[0].id
            }
          }, res);
        case 24:
          _context13.next = 26;
          return connection.query("INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES (?, ?, 'accepted')", [sender_id, receiver_id]);
        case 26:
          return _context13.abrupt("return");
        case 27:
          _context13.next = 29;
          return connection.query("SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", [sender_id, receiver_id, receiver_id, sender_id]);
        case 29:
          _yield$connection$que29 = _context13.sent;
          _yield$connection$que30 = (0, _slicedToArray2["default"])(_yield$connection$que29, 1);
          existingFriend = _yield$connection$que30[0];
          if (!(existingFriend.length > 0)) {
            _context13.next = 34;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            error: "Users are already friends."
          }));
        case 34:
          _context13.next = 36;
          return connection.query("INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES (?, ?, 'pending')", [sender_id, receiver_id]);
        case 36:
          // Send the response
          res.status(200).json({
            message: "Friend request sent successfully."
          });
          _context13.next = 43;
          break;
        case 39:
          _context13.prev = 39;
          _context13.t0 = _context13["catch"](0);
          console.error("Error sending friend request:", _context13.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });
        case 43:
          _context13.prev = 43;
          if (connection) connection.release(); // Release the connection
          return _context13.finish(43);
        case 46:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 39, 43, 46]]);
  }));
  return function sendFriendRequest(_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to accept a friend request
//
var acceptFriendRequest = exports.acceptFriendRequest = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res) {
    var connection, requestId, _yield$connection$que31, _yield$connection$que32, friendRequest, _friendRequest$, sender_id, receiver_id;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context14.sent;
          // Get the request id from the request body
          requestId = req.body.requestId; // Verify if the friend request exists and is pending
          _context14.next = 7;
          return connection.query("SELECT * FROM friend_requests WHERE id = ? AND status = 'pending'", [requestId]);
        case 7:
          _yield$connection$que31 = _context14.sent;
          _yield$connection$que32 = (0, _slicedToArray2["default"])(_yield$connection$que31, 1);
          friendRequest = _yield$connection$que32[0];
          if (!(friendRequest.length === 0)) {
            _context14.next = 12;
            break;
          }
          return _context14.abrupt("return", res.status(400).json({
            error: "Friend request does not exist or is not pending."
          }));
        case 12:
          _friendRequest$ = friendRequest[0], sender_id = _friendRequest$.sender_id, receiver_id = _friendRequest$.receiver_id; // Update the status of the friend request to accepted
          _context14.next = 15;
          return connection.query("UPDATE friend_requests SET status = 'accepted' WHERE id = ?", [requestId]);
        case 15:
          _context14.next = 17;
          return connection.query("INSERT INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)", [sender_id, receiver_id, receiver_id, sender_id]);
        case 17:
          _context14.next = 19;
          return connection.query("UPDATE friend_requests SET status = 'accepted' WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)", [sender_id, receiver_id, receiver_id, sender_id]);
        case 19:
          // Send the response
          res.status(200).json({
            message: "Friend request accepted successfully."
          });
          _context14.next = 26;
          break;
        case 22:
          _context14.prev = 22;
          _context14.t0 = _context14["catch"](0);
          console.error("Error accepting friend request:", _context14.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });
        case 26:
          _context14.prev = 26;
          if (connection) connection.release(); // Release the connection
          return _context14.finish(26);
        case 29:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[0, 22, 26, 29]]);
  }));
  return function acceptFriendRequest(_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to get friend request status
//
var getFriendRequestStatus = exports.getFriendRequestStatus = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res) {
    var _req$body2, sender_id, receiver_id, connection, _yield$connection$que33, _yield$connection$que34, requestStatus;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _req$body2 = req.body, sender_id = _req$body2.sender_id, receiver_id = _req$body2.receiver_id;
          _context15.prev = 1;
          _context15.next = 4;
          return (0, _database.getConnection)();
        case 4:
          connection = _context15.sent;
          console.log("userId: ", sender_id);
          console.log("targetUserId: ", receiver_id);
          _context15.next = 9;
          return connection.query("SELECT status FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?)", [sender_id, receiver_id, receiver_id, sender_id]);
        case 9:
          _yield$connection$que33 = _context15.sent;
          _yield$connection$que34 = (0, _slicedToArray2["default"])(_yield$connection$que33, 1);
          requestStatus = _yield$connection$que34[0];
          if (requestStatus.length > 0) {
            res.status(200).json(requestStatus[0]);
          } else {
            res.status(200).json({
              status: "none"
            });
          }
          _context15.next = 19;
          break;
        case 15:
          _context15.prev = 15;
          _context15.t0 = _context15["catch"](1);
          console.error("Error fetching friend request status:", _context15.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });
        case 19:
          _context15.prev = 19;
          if (connection) connection.release();
          return _context15.finish(19);
        case 22:
        case "end":
          return _context15.stop();
      }
    }, _callee15, null, [[1, 15, 19, 22]]);
  }));
  return function getFriendRequestStatus(_x29, _x30) {
    return _ref15.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to remove a friend request
//
var removeFriendRequest = exports.removeFriendRequest = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res) {
    var connection, _req$params, userId, friendId, _yield$connection$que35, _yield$connection$que36, existingRequest, _yield$connection$que37, _yield$connection$que38, deleteRequestResult;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          _context16.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context16.sent;
          _req$params = req.params, userId = _req$params.userId, friendId = _req$params.friendId; // Verify if the friend request exists
          _context16.next = 7;
          return connection.query("SELECT * FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)", [userId, friendId, friendId, userId]);
        case 7:
          _yield$connection$que35 = _context16.sent;
          _yield$connection$que36 = (0, _slicedToArray2["default"])(_yield$connection$que35, 1);
          existingRequest = _yield$connection$que36[0];
          if (!(existingRequest.length === 0)) {
            _context16.next = 12;
            break;
          }
          return _context16.abrupt("return", res.status(400).json({
            error: "Friend request does not exist."
          }));
        case 12:
          _context16.next = 14;
          return connection.query("DELETE FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)", [userId, friendId, friendId, userId]);
        case 14:
          _yield$connection$que37 = _context16.sent;
          _yield$connection$que38 = (0, _slicedToArray2["default"])(_yield$connection$que37, 1);
          deleteRequestResult = _yield$connection$que38[0];
          if (!(deleteRequestResult.affectedRows === 0)) {
            _context16.next = 19;
            break;
          }
          return _context16.abrupt("return", res.status(400).json({
            error: "Failed to remove friend request."
          }));
        case 19:
          res.status(200).json({
            message: "Friend request removed successfully."
          });
          _context16.next = 26;
          break;
        case 22:
          _context16.prev = 22;
          _context16.t0 = _context16["catch"](0);
          console.error("Error removing friend request:", _context16.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });
        case 26:
          _context16.prev = 26;
          if (connection) connection.release(); // Release the connection
          return _context16.finish(26);
        case 29:
        case "end":
          return _context16.stop();
      }
    }, _callee16, null, [[0, 22, 26, 29]]);
  }));
  return function removeFriendRequest(_x31, _x32) {
    return _ref16.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to remove a friend
//
var removeFriend = exports.removeFriend = /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res) {
    var connection, _req$params2, userId, friendId, _yield$connection$que39, _yield$connection$que40, existingFriend, _yield$connection$que41, _yield$connection$que42, deleteFriendResult;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return (0, _database.getConnection)();
        case 3:
          connection = _context17.sent;
          _req$params2 = req.params, userId = _req$params2.userId, friendId = _req$params2.friendId; // Verify if the users are friends
          _context17.next = 7;
          return connection.query("SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", [userId, friendId, friendId, userId]);
        case 7:
          _yield$connection$que39 = _context17.sent;
          _yield$connection$que40 = (0, _slicedToArray2["default"])(_yield$connection$que39, 1);
          existingFriend = _yield$connection$que40[0];
          if (!(existingFriend.length === 0)) {
            _context17.next = 12;
            break;
          }
          return _context17.abrupt("return", res.status(400).json({
            error: "Friendship does not exist."
          }));
        case 12:
          _context17.next = 14;
          return connection.query("DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", [userId, friendId, friendId, userId]);
        case 14:
          _yield$connection$que41 = _context17.sent;
          _yield$connection$que42 = (0, _slicedToArray2["default"])(_yield$connection$que41, 1);
          deleteFriendResult = _yield$connection$que42[0];
          if (!(deleteFriendResult.affectedRows === 0)) {
            _context17.next = 19;
            break;
          }
          return _context17.abrupt("return", res.status(400).json({
            error: "Failed to remove friendship."
          }));
        case 19:
          _context17.next = 21;
          return connection.query("DELETE FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)", [userId, friendId, friendId, userId]);
        case 21:
          res.status(200).json({
            message: "Friend removed successfully."
          });
          _context17.next = 28;
          break;
        case 24:
          _context17.prev = 24;
          _context17.t0 = _context17["catch"](0);
          console.error("Error removing friend:", _context17.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });
        case 28:
          _context17.prev = 28;
          if (connection) connection.release(); // Release the connection
          return _context17.finish(28);
        case 31:
        case "end":
          return _context17.stop();
      }
    }, _callee17, null, [[0, 24, 28, 31]]);
  }));
  return function removeFriend(_x33, _x34) {
    return _ref17.apply(this, arguments);
  };
}();

///////////////////////////////////////////////////////////////////
// Function to validate token
//
var validateToken = exports.validateToken = function validateToken(req, res) {
  var token = req.body.token;
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