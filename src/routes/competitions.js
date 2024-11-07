// Urls that the app can visit
import { Router } from "express";
import {
	createCompetition,
	getCompetitionById,
	updateCompetition,
	deleteCompetition,
	addTeamToCompetition,
	removeTeamFromCompetition,
	generateMatchesAndReserve,
	deleteCompetitionMatches,
	getCompetitionTeams,
	getCompetitionsByUser,
	getAllCompetitions,
	getCustomTeamsNotInCompetition,
	getCompetitionMatches,
} from "../controllers/competitions.js";

const router = Router();

// Swagger
/**
 * @swagger
 * tags:
 *  name: Competitions
 *  description: Competitions endpoints
 */

/**
 * @swagger
 * /competitions:
 *   post:
 *     summary: Create a new competition
 *     tags:
 *       - competitions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [scheduled, canceled, finished]
 *               logo_url:
 *                 type: string
 *               created_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Competition created successfully
 *       500:
 *         description: Error creating competition
 */
router.post("/competitions/create", createCompetition); // Create competition

/**
 * @swagger
 * /competitions/{id}:
 *   get:
 *     summary: Get competition by ID
 *     tags:
 *       - competitions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the competition to retrieve
 *     responses:
 *       200:
 *         description: Competition details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Competition not found
 *       500:
 *         description: Error retrieving competition
 */
router.get("/competitions/:id", getCompetitionById); // Get competition by ID

/**
 * @swagger
 * /competitions/{id}:
 *   put:
 *     summary: Update an existing competition
 *     tags:
 *       - competitions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the competition to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [scheduled, canceled, finished]
 *               logo_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Competition updated successfully
 *       404:
 *         description: Competition not found
 *       500:
 *         description: Error updating competition
 */
router.put("/competitions/:id", updateCompetition); // Update competition

/**
 * @swagger
 * /competitions/{id}:
 *   delete:
 *     summary: Delete a competition
 *     tags:
 *       - competitions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the competition to delete
 *     responses:
 *       200:
 *         description: Competition deleted successfully
 *       404:
 *         description: Competition not found
 *       500:
 *         description: Error deleting competition
 */
router.delete("/competitions/:id", deleteCompetition); // Delete competition

/**
 * @swagger
 * /competitions/team:
 *   post:
 *     summary: Add a team to a competition
 *     tags:
 *       - competitions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               team_id:
 *                 type: integer
 *               competition_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Team added to competition successfully
 *       500:
 *         description: Error adding team to competition
 */
router.post("/competitions/team", addTeamToCompetition); // Add team to competition

/**
 * @swagger
 * /competitions/team:
 *   delete:
 *     summary: Remove a team from a competition
 *     tags:
 *       - competitions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               team_id:
 *                 type: integer
 *               competition_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Team removed from competition successfully
 *       404:
 *         description: Team not found in competition
 *       500:
 *         description: Error removing team from competition
 */
router.delete(
	"/competitions/:comp_id/team/:team_id",
	removeTeamFromCompetition
); // Remove team from competition

/**
 * @swagger
 * /competitions/{id}/draw_and_reserve:
 *   post:
 *     summary: Draw teams for a competition and reserve slots
 *     tags:
 *       - competitions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the competition
 *     responses:
 *       200:
 *         description: Matches created and slots reserved successfully
 *       404:
 *         description: Competition not found
 *       400:
 *         description: Not enough teams to create matches
 *       500:
 *         description: Server error generating matches and reservations
 */
router.post("/competitions/:id/draw_and_reserve", generateMatchesAndReserve); // Draw teams and reserve slots for a competition

/**
 * @swagger
 * /competitions/{id}/matches:
 *   delete:
 *     summary: Delete all matches for a competition and reset is_draw
 *     tags:
 *       - competitions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the competition
 *     responses:
 *       200:
 *         description: Matches deleted and is_draw reset
 *       404:
 *         description: Competition not found
 *       500:
 *         description: Server error
 */
router.delete("/competitions/:id/matches", deleteCompetitionMatches); // Delete all matches for a competition and reset is_draw

/**
 * @swagger
 * /competitions/{id}/teams:
 *   get:
 *     summary: Get list of teams in a competition
 *     tags:
 *       - competitions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the competition to retrieve teams for
 *     responses:
 *       200:
 *         description: List of teams in the competition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teams:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the team
 *                       name:
 *                         type: string
 *                         description: Name of the team
 *                       short_name:
 *                         type: string
 *                         description: Short name of the team
 *                       logo_url:
 *                         type: string
 *                         description: URL of the team's logo
 *       404:
 *         description: No teams found for this competition
 *       500:
 *         description: Server error
 */
router.get("/competitions/:id/teams", getCompetitionTeams); // Get list of teams in a competition

/**
 * @swagger
 * /competitions/user/{userId}:
 *   get:
 *     summary: Get competitions created by a specific user
 *     tags:
 *       - competitions
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of competitions created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   end_date:
 *                     type: string
 *                     format: date
 *                   status:
 *                     type: string
 *                   logo_url:
 *                     type: string
 *                   created_by:
 *                     type: integer
 *       404:
 *         description: No competitions found for this user
 *       500:
 *         description: Server error
 */
router.get("/competitions/user/:userId", getCompetitionsByUser);

/**
 * @swagger
 * /competitions:
 *   get:
 *     summary: Get all competitions
 *     tags:
 *       - competitions
 *     responses:
 *       200:
 *         description: List of all competitions
 *       500:
 *         description: Server error
 */
router.get("/competitions", getAllCompetitions);

/**
 * @swagger
 * /teams/custom/not_in_competition/{competitionId}:
 *   get:
 *     summary: Get all custom teams not in a specific competition
 *     tags:
 *       - teams
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the competition
 *     responses:
 *       200:
 *         description: List of custom teams not in the competition
 *       500:
 *         description: Server error
 */
router.get(
	"/competitions/:competitionId/teams_custom_not_in",
	getCustomTeamsNotInCompetition
);

/**
 * @swagger
 * /competitions/{id}/matches:
 *   get:
 *     summary: Get all matches for a specific competition
 *     tags:
 *       - competitions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the competition
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of matches for the specified competition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 matches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       match_id:
 *                         type: integer
 *                       team_a:
 *                         type: string
 *                       team_b:
 *                         type: string
 *                       status:
 *                         type: string
 *                       pitch_id:
 *                         type: integer
 *                       date_time:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Competition not found
 *       500:
 *         description: Server error
 */
router.get("/competitions/:id/matches", getCompetitionMatches);

export default router;
