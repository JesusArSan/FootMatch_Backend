import { Router } from "express";
import {
	createTeam,
	updateTeam,
	deleteTeam,
	addUserToTeam,
	removeUserFromTeam,
	getCreatedTeamsByUser,
	getTeamsByUser,
	getTeamUsers,
} from "../controllers/teams.js";

const router = Router();

// Swagger documentation for teams
/**
 * @swagger
 * tags:
 *  name: Teams
 *  description: Teams endpoints
 */

/**
 * @swagger
 * /teams:
 *  post:
 *    summary: Create a new team
 *    tags: [Teams]
 */
router.post("/teams", createTeam); // Create a new team

/**
 * @swagger
 * /teams/{id}:
 *  put:
 *    summary: Update a team by ID
 *    tags: [Teams]
 */
router.put("/teams/:id", updateTeam); // Update an existing team

/**
 * @swagger
 * /teams/{id}:
 *  delete:
 *    summary: Delete a team by ID
 *    tags: [Teams]
 */
router.delete("/teams/:id", deleteTeam); // Delete a team by ID

/**
 * @swagger
 * /teams/{team_id}/add_user/{user_id}:
 *  post:
 *    summary: Add a user to a team
 *    tags: [Teams]
 */
router.post("/teams/:team_id/add_user/:user_id", addUserToTeam); // Add a user to a team

/**
 * @swagger
 * /teams/user/{user_id}/created:
 *  get:
 *    summary: Get teams created by a user
 *    tags: [Teams]
 */
router.get("/teams/user/:user_id/created", getCreatedTeamsByUser); // Get teams created by a user

/**
 * @swagger
 * /teams/user/{user_id}:
 *  get:
 *    summary: Get teams a user belongs to
 *    tags: [Teams]
 */
router.get("/teams/user/:user_id", getTeamsByUser); // Get teams a user belongs to

/**
 * @swagger
 * /teams/{team_id}/remove_user/{user_id}:
 *  delete:
 *    summary: Remove a user from a team
 *    tags: [Teams]
 */
router.delete("/teams/:team_id/remove_user/:user_id", removeUserFromTeam); // Remove a user from a team

/**
 * @swagger
 * /teams/{team_id}/users:
 *  get:
 *    summary: Get users in a team
 *    tags: [Teams]
 */
router.get("/teams/:team_id/users", getTeamUsers); // Get users in a team

export default router;
