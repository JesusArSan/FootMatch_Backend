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

export default router;
