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
	getFriends,
	isFriend,
	getFriendRequests,
	sendFriendRequest,
	acceptFriendRequest,
	getFriendRequestStatus,
	removeFriendRequest,
	removeFriend,
	validateToken,
	updateProfilePhoto,
	updateUserRole,
} from "../controllers/users.js";

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

/**
 * @swagger
 * /users/friends/{id}:
 * get:
 *   summary: Get friends
 *   tags: [Users]
 */
router.get("/users/friends/:id", getFriends); // Get Friends

/**
 * @swagger
 * /users/friends/{id}:
 * get:
 *   summary: is Friend
 *   tags: [Users]
 */
router.post("/users/friends/", isFriend); // isFriend

/**
 * @swagger
 * /users/friend_requests/{id}:
 * get:
 *   summary: Get friend requests
 *   tags: [Users]
 */
router.get("/users/friend_requests/:id", getFriendRequests); // Get Friend Requests

/**
 * @swagger
 * /users/send_friend_request:
 * post:
 *   summary: Send friend request
 *   tags: [Users]
 */
router.post("/users/friend_requests", sendFriendRequest); // Send Friend Request

/**
 * @swagger
 * /users/friend_request/accept:
 * post:
 *   summary: Accept friend request
 *   tags: [Users]
 */
router.put("/users/friend_requests/accept", acceptFriendRequest); // Accept Friend Request

/**
 * @swagger
 * /users/remove_friend:
 * post:
 *   summary: Remove Friend
 *   tags: [Users]
 */
router.delete("/users/remove_friend/:userId/:friendId", removeFriend); // Remove friend

/**
 * @swagger
 * /users/friend_request/status:
 * post:
 *   summary: Remove Friend
 *   tags: [Users]
 */
router.post("/users/friend_requests/status/", getFriendRequestStatus); // Remove friend

/**
 * @swagger
 * /users/friend_request/status:
 * post:
 *   summary: Remove Friend Request
 *   tags: [Friend Requests]
 */
router.delete("/users/friend_requests/:userId/:friendId", removeFriendRequest); // Remove friend request

/**
 * @swagger
 * /users/{userId}/update_photo:
 *   put:
 *     summary: Update User Profile Photo
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               photoUrl:
 *                 type: string
 *                 description: The URL of the new profile photo
 *     responses:
 *       200:
 *         description: Profile photo updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.put("/users/:userId/update_photo", updateProfilePhoto);

/**
 * @swagger
 * /users/{user_id}/update_role:
 *  put:
 *    summary: Update a user's role
 *    tags: [Users]
 *    parameters:
 *      - name: user_id
 *        in: path
 *        required: true
 *        description: ID of the user to update
 *        schema:
 *          type: integer
 *      - name: role_id
 *        in: body
 *        required: true
 *        description: New role ID for the user
 *        schema:
 *          type: integer
 */
router.put("/users/:user_id/update_role", updateUserRole); // Update user role

export default router;
