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
	changeMatchStatus,
	changeMatchAccessType,
	getMatchesByAccessType,
	setNewLocalTeamToMatch,
	setNewVisitorTeamToMatch,
	removeAllPlayersFromMatch,
	addPlayersToMatchFromTeam,
	setParticipantGoals,
	setParticipantAssists,
	setMatchGoals,
	setMatchIsDone,
	getMatchDone,
	updateMatchParticipantTeam,
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

/**
 * @swagger
 * /matches/newstatus/:
 *   put:
 *     summary: Change the status of a match
 *     tags: [matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matchId
 *               - status
 *             properties:
 *               matchId:
 *                 type: integer
 *                 description: ID of the match to change the status of
 *                 example: 123
 *               status:
 *                 type: string
 *                 description: New status of the match (scheduled, completed, canceled)
 *                 enum: [scheduled, completed, canceled]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Match status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Match status updated successfully
 *                 matchId:
 *                   type: integer
 *                   example: 123
 *                 status:
 *                   type: string
 *                   example: completed
 *       400:
 *         description: Bad request, match not found or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Match does not exist.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating match status.
 */
router.put("/matches/newstatus/", changeMatchStatus); // Route to change status of a match

/**
 * @swagger
 * /matches/change_access_type:
 *  put:
 *    summary: Change the access type of a match
 *    tags: [Matches]
 */
router.put("/matches/change_access_type", changeMatchAccessType); // Change match access type

/**
 * @swagger
 * /matches/access_type/{accessType}:
 *  get:
 *    summary: Get matches by access type
 *    tags: [Matches]
 *    parameters:
 *      - in: path
 *        name: accessType
 *        schema:
 *          type: string
 *        required: true
 *        description: The access type of the matches ('public' or 'private')
 *    responses:
 *      200:
 *        description: List of matches by access type
 *      400:
 *        description: Invalid access type
 *      500:
 *        description: Server error
 */
router.get("/matches/access_type/:accessType", getMatchesByAccessType);

/**
 * @swagger
 * /matches/{matchId}/setLocalTeam:
 *  put:
 *    summary: Set a new local team for a match
 *    tags: [Matches]
 *    parameters:
 *      - in: path
 *        name: matchId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the match
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              teamId:
 *                type: integer
 *                description: The ID of the new local team
 *    responses:
 *      200:
 *        description: Local team set successfully
 *      400:
 *        description: Invalid teamId or matchId
 *      404:
 *        description: Match or team not found
 *      500:
 *        description: Server error
 */
router.put("/matches/setLocalTeam", setNewLocalTeamToMatch);

/**
 * @swagger
 * /matches/{matchId}/setVisitorTeam:
 *  put:
 *    summary: Set a new visitor team for a match
 *    tags: [Matches]
 *    parameters:
 *      - in: path
 *        name: matchId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the match
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              teamId:
 *                type: integer
 *                description: The ID of the new visitor team
 *    responses:
 *      200:
 *        description: Visitor team set successfully
 *      400:
 *        description: Invalid teamId or matchId
 *      404:
 *        description: Match or team not found
 *      500:
 *        description: Server error
 */
router.put("/matches/setVisitorTeam", setNewVisitorTeamToMatch);

/**
 * @swagger
 * /matches/{matchId}/players:
 *   delete:
 *     summary: Remove all players from a match
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the match
 *     responses:
 *       200:
 *         description: All players removed from the match successfully
 *       500:
 *         description: Server error
 */
router.delete("/matches/:matchId/players", removeAllPlayersFromMatch);

/**
 * @swagger
 * /matches/{matchId}/teams/{teamId}/players:
 *   post:
 *     summary: Add players from a custom team to a match
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the match
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the custom team
 *     responses:
 *       200:
 *         description: Players from the custom team added to the match successfully
 *       404:
 *         description: No players found in the specified custom team
 *       500:
 *         description: Server error
 */
router.post(
	"/matches/:matchId/teams/:teamId/players",
	addPlayersToMatchFromTeam
);

/**
 * @swagger
 * /matches/participants/goals:
 *  put:
 *    summary: Set goals for a participant in a match
 *    tags: [matches]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - matchId
 *              - userId
 *              - goals
 *            properties:
 *              matchId:
 *                type: integer
 *                description: The ID of the match
 *              userId:
 *                type: integer
 *                description: The ID of the participant
 *              goals:
 *                type: integer
 *                description: Number of goals scored by the participant
 *    responses:
 *      200:
 *        description: Participant goals updated successfully
 *      404:
 *        description: Participant not found in the match
 *      500:
 *        description: Server error
 */
router.put("/matches/participants/goals", setParticipantGoals);

/**
 * @swagger
 * /matches/participants/assists:
 *  put:
 *    summary: Set assists for a participant in a match
 *    tags: [matches]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - matchId
 *              - userId
 *              - assists
 *            properties:
 *              matchId:
 *                type: integer
 *                description: The ID of the match
 *              userId:
 *                type: integer
 *                description: The ID of the participant
 *              assists:
 *                type: integer
 *                description: Number of assists made by the participant
 *    responses:
 *      200:
 *        description: Participant assists updated successfully
 *      404:
 *        description: Participant not found in the match
 *      500:
 *        description: Server error
 */
router.put("/matches/participants/assists", setParticipantAssists);

/**
 * @swagger
 * /matches/goals:
 *  put:
 *    summary: Set match score for teams A and B
 *    tags: [matches]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - matchId
 *              - teamAScore
 *              - teamBScore
 *            properties:
 *              matchId:
 *                type: integer
 *                description: The ID of the match
 *              teamAScore:
 *                type: integer
 *                description: Score of team A
 *              teamBScore:
 *                type: integer
 *                description: Score of team B
 *    responses:
 *      200:
 *        description: Match score updated successfully
 *      404:
 *        description: Match not found
 *      500:
 *        description: Server error
 */
router.put("/matches/goals", setMatchGoals);

/**
 * @swagger
 * /matches/{matchId}/done:
 *   put:
 *     summary: Set match as done
 *     tags:
 *       - matches
 *     parameters:
 *       - in: path
 *         name: matchId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the match to mark as done
 *     responses:
 *       200:
 *         description: Match marked as done
 *       404:
 *         description: Match not found or already marked as done
 *       500:
 *         description: Server error
 */
router.put("/matches/:matchId/done", setMatchIsDone); // Set match as done

/**
 * @swagger
 * /matches/{matchId}/done:
 *   get:
 *     summary: Get match done status
 *     tags:
 *       - matches
 *     parameters:
 *       - in: path
 *         name: matchId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the match to get the done status
 *     responses:
 *       200:
 *         description: Returns the match done status
 *       404:
 *         description: Match not found
 *       500:
 *         description: Server error
 */
router.get("/matches/:matchId/done", getMatchDone); // Get match done status

/**
 * @swagger
 * /matches/{matchId}/participants/{userId}/team:
 *   put:
 *     summary: Update team for a match participant
 *     tags:
 *       - match participants
 *     parameters:
 *       - in: path
 *         name: matchId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the match
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the participant (user)
 *       - in: body
 *         name: teamId
 *         required: true
 *         description: The ID of the new team to assign to the participant
 *         schema:
 *           type: object
 *           properties:
 *             teamId:
 *               type: integer
 *     responses:
 *       200:
 *         description: Team updated successfully for the match participant
 *       404:
 *         description: Match participant not found
 *       500:
 *         description: Server error
 */
router.put("/matches/:matchId/participants/:userId/team", updateMatchParticipantTeam);

export default router;
