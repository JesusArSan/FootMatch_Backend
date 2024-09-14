// Urls that the app can visit
import { Router } from "express";
import {
	getMatches,
	createMatch,
	cancelMatch,
	getMatchParticipants,
	getMatchById,
	addMatchParticipant,
	deleteMatchParticipant,
	getMatchInvitations,
	addMatchInvitation,
	deleteMatchInvitation,
	acceptMatchInvitation,
	rejectMatchInvitation,
	getMatchesByStatus,
	getUserMatchInvitations,
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
 * /matches/status/{status}:
 *   get:
 *     summary: Get all matches from a user by status
 *     tags: [matches]
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: The status of the match
 *     responses:
 *       200:
 *         description: List of matches
 */
router.get("/matches/status/:user_id/:status", getMatchesByStatus); // Obtain all matches from a user by status

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

/**
 * @swagger
 * /matches/participants:
 *   post:
 *     summary: Add a participant to a match
 *     tags:
 *       - matches
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matchId
 *               - userId
 *             properties:
 *               matchId:
 *                 type: integer
 *                 description: The ID of the match
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to add as a participant
 *     responses:
 *       201:
 *         description: Participant added successfully
 *       400:
 *         description: Participant already exists
 *       500:
 *         description: Server error
 */
router.post("/matches/participants", addMatchParticipant); // Route to add participant to a match

/**
 * @swagger
 * /matches/participants:
 *   delete:
 *     summary: Delete a participant from a match
 *     tags:
 *       - matches
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matchId
 *               - userId
 *             properties:
 *               matchId:
 *                 type: integer
 *                 description: The ID of the match
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to delete as a participant
 *     responses:
 *       200:
 *         description: Participant deleted successfully
 *       400:
 *         description: Participant does not exist
 *       500:
 *         description: Server error
 */
router.delete("/matches/participants", deleteMatchParticipant); // Route to delete participant from a match

/**
 * @swagger
 * /matches/invitations/{match_id}:
 *  get:
 *    summary: Get the invitations of a match
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
 *        description: List of invitations
 *      500:
 *        description: Server error
 */
router.get("/matches/invitations/:match_id", getMatchInvitations); // Route to get invitations of a match

/**
 * @swagger
 * /matches/invitations:
 *  post:
 *    summary: Add an invitation for a user to a match
 *    tags: [matches]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              matchId:
 *                type: integer
 *                description: The ID of the match
 *              userId:
 *                type: integer
 *                description: The ID of the user to invite
 *            required:
 *              - matchId
 *              - userId
 *    responses:
 *      201:
 *        description: Invitation sent successfully
 *      400:
 *        description: User or match does not exist, or invitation already exists
 *      500:
 *        description: Server error
 */
router.post("/matches/invitations", addMatchInvitation);

/**
 * @swagger
 * /matches/invitations/{matchId}/{userId}:
 *  delete:
 *    summary: Delete an invitation for a user to a match
 *    tags: [matches]
 *    parameters:
 *      - in: path
 *        name: matchId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the match
 *      - in: path
 *        name: userId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the user whose invitation will be deleted
 *    responses:
 *      200:
 *        description: Invitation deleted successfully
 *      400:
 *        description: Invitation does not exist
 *      500:
 *        description: Server error
 */
router.delete("/matches/invitations/:matchId/:userId", deleteMatchInvitation);

/**
 * @swagger
 * /matches/invitations/accept:
 *  put:
 *    summary: Accept an invitation to a match and add the user as a participant
 *    tags: [matches]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              matchId:
 *                type: integer
 *                description: The ID of the match
 *              userId:
 *                type: integer
 *                description: The ID of the user
 *            required:
 *              - matchId
 *              - userId
 *    responses:
 *      200:
 *        description: Invitation accepted and participant added successfully
 *      400:
 *        description: Invitation does not exist or required fields are missing
 *      500:
 *        description: Server error
 */
router.put("/matches/invitations/accept", acceptMatchInvitation);

/**
 * @swagger
 * /matches/invitations/reject:
 *  put:
 *    summary: Reject an invitation to a match
 *    tags: [matches]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              matchId:
 *                type: integer
 *                description: The ID of the match
 *              userId:
 *                type: integer
 *                description: The ID of the user
 *            required:
 *              - matchId
 *              - userId
 *    responses:
 *      200:
 *        description: Invitation rejected successfully
 *      400:
 *        description: Invitation does not exist or required fields are missing
 *      500:
 *        description: Server error
 */
router.put("/matches/invitations/reject", rejectMatchInvitation);

/**
 * @swagger
 * /matches/invitations/{user_id}/{status}:
 *   get:
 *     summary: Get all match invitations for a user by status
 *     tags: [matches]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: The status of the invitations (pending, accepted, rejected)
 *     responses:
 *       200:
 *         description: List of match invitations with match details
 *       500:
 *         description: Server error
 */
router.get("/matches/invitations/:user_id/:status", getUserMatchInvitations); // Route to get user match invitations by status

export default router;
