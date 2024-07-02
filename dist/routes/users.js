"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _users = require("../controllers/users");
// Urls that the app can visit

var router = (0, _express.Router)();

// Swagger
/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users endpoints
 */

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get all users
 *    tags: [Users]
 */
router.get("/users", _users.getUsers); // Obtener todas las usuarios

/**
 * @swagger
 * /users/count:
 *  get:
 *    summary: Get the number of users
 *    tags: [Users]
 */
router.get("/users/count", _users.getUsersCount); // Obtener núm usuarios

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: Get a user
 *    tags: [Users]
 */
router.get("/users/:id", _users.getUser); // Obtener una usuario

/**
 * @swagger
 * /users/username/{username}:
 *  get:
 *    summary: Get a user by username
 *    tags: [Users]
 */
router.get("/users/username/:username", _users.getUserByUsername); // Obtener un usuario por nombre de usuario

/**
 * @swagger
 * /users/email/{email}:
 *  get:
 *    summary: Get a user by email
 *    tags: [Users]
 */
router.get("/users/email/:email", _users.getUserByEmail); // Obtener un usuario por correo electrónico

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Add a user
 *    tags: [Users]
 */
router.post("/users/signup", _users.createUser); // Create an user

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: Delete a user
 *    tags: [Users]
 */
router["delete"]("/users/:id", _users.deleteUser); // borra una unica usuario

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Update a user
 *    tags: [Users]
 */
router.put("/users/:id", _users.updateUser); // Actualizar una usuario

/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: Login
 *    tags: [Users]
 */
router.post("/users/login", _users.loginUser); // Login

/**
 * @swagger
 * /users/token:
 *  post:
 *    summary: Token Validation
 *    tags: [token]
 */
router.post("/users/token", _users.validateToken); // Validate Token
var _default = exports["default"] = router;