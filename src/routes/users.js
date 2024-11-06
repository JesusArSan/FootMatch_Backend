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
	getLatestCompletedMatchForUser,
	createPublication,
	deletePublication,
	getFriendsPublications,
	addLike,
	removeLike,
	getLikes,
	updateUserExp,
	getUserExp,
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

/**
 * @swagger
 * /users/{userId}/completed-match:
 *  get:
 *    summary: Get the latest completed match for a user
 *    tags: [matches]
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID of the user
 *    responses:
 *      200:
 *        description: Latest completed match details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                matchId:
 *                  type: integer
 *                  description: ID of the match
 *                teamA:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Name of team A
 *                    logo:
 *                      type: string
 *                      description: Logo URL of team A
 *                    score:
 *                      type: integer
 *                      description: Score of team A
 *                teamB:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Name of team B
 *                    logo:
 *                      type: string
 *                      description: Logo URL of team B
 *                    score:
 *                      type: integer
 *                      description: Score of team B
 *                status:
 *                  type: string
 *                  description: Status of the match (e.g., completed)
 *                date:
 *                  type: string
 *                  format: date-time
 *                  description: Date and time of the match
 *      404:
 *        description: No completed matches found for this user
 *      500:
 *        description: Server error
 */
router.get("/users/:userId/completed-match", getLatestCompletedMatchForUser);

/**
 * @swagger
 * /publications:
 *   post:
 *     summary: Create a new publication
 *     tags:
 *       - publications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_on:
 *                 type: string
 *                 format: date-time
 *               text:
 *                 type: string
 *               likes:
 *                 type: integer
 *                 default: 0
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Publication created successfully
 *       500:
 *         description: Error creating publication
 */
router.post("/users/publications", createPublication); // Create publication

/**
 * @swagger
 * /publications/{id}:
 *   delete:
 *     summary: Delete a publication by ID
 *     tags:
 *       - publications
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the publication to delete
 *     responses:
 *       200:
 *         description: Publication deleted successfully
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Error deleting publication
 */
router.delete("/users/publications/:id", deletePublication); // Delete publication

/**
 * @swagger
 * /publications/friends/{id}:
 *   get:
 *     summary: Get publications from friends
 *     tags:
 *       - publications
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to get friends' publications
 *     responses:
 *       200:
 *         description: Friends' publications retrieved successfully
 *       500:
 *         description: Error retrieving friends' publications
 */
router.get("/users/publications/friends/:id", getFriendsPublications); // Get friends' publications

/**
 * @swagger
 * /publications/{id}/like:
 *   post:
 *     summary: Add a like to a publication
 *     tags:
 *       - publications
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the publication to add a like
 *     responses:
 *       200:
 *         description: Like added successfully
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Error adding like
 */
router.post("/users/publications/:id/like", addLike); // Add like to publication

/**
 * @swagger
 * /publications/{id}/like:
 *   delete:
 *     summary: Remove a like from a publication
 *     tags:
 *       - publications
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the publication to remove a like
 *     responses:
 *       200:
 *         description: Like removed successfully
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Error removing like
 */
router.delete("/users/publications/:id/like", removeLike); // Remove like from publication

/**
 * @swagger
 * /publications/{id}/likes:
 *   get:
 *     summary: Get the number of likes of a publication
 *     tags:
 *       - publications
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the publication to get the like count
 *     responses:
 *       200:
 *         description: Like count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: integer
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Error getting like count
 */
router.get("/users/publications/:id/likes", getLikes); // Get likes of publication

/**
 * @swagger
 * /users/{id}/exp:
 *   put:
 *     summary: Update user experience points
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to update experience points
 *     responses:
 *       200:
 *         description: User experience points updated successfully
 *       404:
 *         description: User not found or no match records found
 *       500:
 *         description: Error updating experience points
 */
router.put("/users/:id/exp", updateUserExp); // Update user experience points

/**
 * @swagger
 * /users/{id}/exp:
 *   get:
 *     summary: Get user experience points
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to get experience points
 *     responses:
 *       200:
 *         description: User experience points retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_exp:
 *                   type: number
 *                   format: float
 *       404:
 *         description: User not found
 *       500:
 *         description: Error getting experience points
 */
router.get("/users/:id/exp", getUserExp); // Get user experience points

export default router;
