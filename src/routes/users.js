// Urls that the app can visit
import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsersCount,
  getUsers,
  updateUser,
  loginUser,
  getUserByUsername,
  getUserByEmail,
  validateToken,
} from "../controllers/users";

const router = Router();

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
router.get("/users", getUsers); // Obtener todas las usuarios

/**
 * @swagger
 * /users/count:
 *  get:
 *    summary: Get the number of users
 *    tags: [Users]
 */
router.get("/users/count", getUsersCount); // Obtener núm usuarios

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: Get a user
 *    tags: [Users]
 */
router.get("/users/:id", getUser); // Obtener una usuario

/**
 * @swagger
 * /users/username/{username}:
 *  get:
 *    summary: Get a user by username
 *    tags: [Users]
 */
router.get("/users/username/:username", getUserByUsername); // Obtener un usuario por nombre de usuario

/**
 * @swagger
 * /users/email/{email}:
 *  get:
 *    summary: Get a user by email
 *    tags: [Users]
 */
router.get("/users/email/:email", getUserByEmail); // Obtener un usuario por correo electrónico

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Add a user
 *    tags: [Users]
 */
router.post("/users/signup", createUser); // Create an user

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: Delete a user
 *    tags: [Users]
 */
router.delete("/users/:id", deleteUser); // borra una unica usuario

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Update a user
 *    tags: [Users]
 */
router.put("/users/:id", updateUser); // Actualizar una usuario

/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: Login
 *    tags: [Users]
 */
router.post("/users/login", loginUser); // Login

/**
 * @swagger
 * /users/token:
 *  post:
 *    summary: Token Validation
 *    tags: [token]
 */
router.post("/users/token", validateToken); // Validate Token

export default router;
