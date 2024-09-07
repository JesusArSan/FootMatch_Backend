// Urls that the app can visit
import { Router } from "express";
import {
	getMatches,
	createMatch,
	cancelMatch,
	getMatchParticipants,
	getMatchById,
} from "../controllers/matches.js";

const router = Router();

// Swagger
/**
 * @swagger
 * tags:
 *  name: matches
 *  description: matches endpoints
 */

/**
 * @swagger
 * /matches:
 *  get:
 *    summary: Get all matches from a user
 *    tags: [matches]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the user
 *    responses:
 *      200:
 *        description: List of matches
 *      500:
 *        description: Server error
 */
router.get("/matches/user/:user_id", getMatches); // Obtain all matches from a user

/**
 * @swagger
 * /matches:
 *  post:
 *    summary: Create a new match
 *    tags: [matches]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - pitchId
 *              - userId
 *              - matchDate
 *            properties:
 *              pitchId:
 *                type: integer
 *                description: The ID of the pitch where the match will be played
 *              userId:
 *                type: integer
 *                description: The ID of the user creating the match
 *              matchDate:
 *                type: string
 *                format: date-time
 *                description: The date and time of the match
 *    responses:
 *      201:
 *        description: Match created successfully
 *      500:
 *        description: Server error
 */
router.post("/matches", createMatch); // Route to create a new match

/**
 * @swagger
 * /matches/cancel:
 *  post:
 *    summary: Cancel a match
 *    tags: [matches]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - matchId
 *            properties:
 *              matchId:
 *                type: integer
 *                description: The ID of the match to be canceled
 *    responses:
 *      200:
 *        description: Match canceled successfully
 *      400:
 *        description: Match does not exist or is already canceled
 *      500:
 *        description: Server error
 */
router.post("/matches/cancel", cancelMatch); // Route to cancel a match

/**
 * @swagger
 * /matches:
 *  get:
 *    summary: Get the participants of a match
 *    tags: [matches]
 *    parameters:
 *      - in: path
 *        name: match_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the match
 *    responses:
 *      200:
 *        description: List of participants
 *      500:
 *        description: Server error
 */
router.get("/matches/participants/:match_id", getMatchParticipants); // Route to get the participants of a match

// Get match by id

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Get match by id
 *     tags:
 *       - matches
 *     parameters:
 *       - in: path
 *         name: match_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the match
 *     responses:
 *       200:
 *         description: Match found
 *       500:
 *         description: Server error
 */
router.get("/matches/:matchId", getMatchById); // Obtain match by id

export default router;
