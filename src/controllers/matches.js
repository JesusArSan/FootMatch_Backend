import { getConnection } from "../database.js";
import crypto from "crypto"; // Import to generate unique names

///////////////////////////////////////////////////////////////////
// MATCHES FUNCTIONS
///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
// Function to get all matches from a user
//
export const getMatches = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const userId = req.params.user_id;

		const [matchesAsCreator] = await connection.query(
			`SELECT m.*, host.date_time AS match_date, host.pitch_id,
					team_a.name AS team_a_name, team_a.logo_url AS team_a_logo,
					team_b.name AS team_b_name, team_b.logo_url AS team_b_logo
				FROM matches m
				LEFT JOIN teams team_a ON m.team_a_id = team_a.id
				LEFT JOIN teams team_b ON m.team_b_id = team_b.id
				LEFT JOIN host ON m.id = host.match_id
				WHERE m.created_by_user_id = ?
				ORDER BY host.date_time ASC`,
			[userId]
		);

		const [matchesAsPlayer] = await connection.query(
			`SELECT m.*, host.date_time AS match_date, host.pitch_id,
					team_a.name AS team_a_name, team_a.logo_url AS team_a_logo,
					team_b.name AS team_b_name, team_b.logo_url AS team_b_logo
				FROM matches m
				LEFT JOIN teams team_a ON m.team_a_id = team_a.id
				LEFT JOIN teams team_b ON m.team_b_id = team_b.id
				JOIN match_participants mp ON m.id = mp.match_id
				LEFT JOIN host ON m.id = host.match_id
				WHERE mp.user_id = ?
				ORDER BY host.date_time ASC`,
			[userId]
		);

		const combinedMatches = [
			...matchesAsCreator,
			...matchesAsPlayer.filter(
				(match) => !matchesAsCreator.some((m) => m.id === match.id)
			),
		];

		res.json(combinedMatches);
	} catch (error) {
		console.error("Error getting matches:", error);
		res.status(500).json({ message: "Error getting matches." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Function to get all match invitations for a user by status
//
export const getUserMatchInvitations = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { user_id, status } = req.params;

		const [matches] = await connection.query(
			`SELECT m.*, host.date_time AS match_date,
					team_a.name AS team_a_name, team_a.logo_url AS team_a_logo,
					team_b.name AS team_b_name, team_b.logo_url AS team_b_logo
			 FROM match_invitations mi
			 JOIN matches m ON mi.match_id = m.id
			 LEFT JOIN teams team_a ON m.team_a_id = team_a.id
			 LEFT JOIN teams team_b ON m.team_b_id = team_b.id
			 LEFT JOIN host ON m.id = host.match_id
			 WHERE mi.user_id = ? AND mi.status = ?`,
			[user_id, status]
		);

		res.json(matches);
	} catch (error) {
		console.error("Error getting match invitations:", error);
		res.status(500).json({ message: "Error getting match invitations." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Function to get all matches from a user
//
export const getMatchesByStatus = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const userId = req.params.user_id;
		const status = req.params.status;

		const [matchesAsCreator] = await connection.query(
			`SELECT m.*, host.date_time AS match_date, host.pitch_id,
					team_a.name AS team_a_name, team_a.logo_url AS team_a_logo, team_a.created_at AS team_a_created_at,
					team_b.name AS team_b_name, team_b.logo_url AS team_b_logo, team_b.created_at AS team_b_created_at
				FROM matches m
				LEFT JOIN teams team_a ON m.team_a_id = team_a.id
				LEFT JOIN teams team_b ON m.team_b_id = team_b.id
				LEFT JOIN host ON m.id = host.match_id
				WHERE m.created_by_user_id = ? AND m.status = ?
				ORDER BY host.date_time ASC`,
			[userId, status]
		);

		const [matchesAsPlayer] = await connection.query(
			`SELECT m.*, host.date_time AS match_date, host.pitch_id,
					team_a.name AS team_a_name, team_a.logo_url AS team_a_logo, team_a.created_at AS team_a_created_at,
					team_b.name AS team_b_name, team_b.logo_url AS team_b_logo, team_b.created_at AS team_b_created_at
				FROM matches m
				LEFT JOIN teams team_a ON m.team_a_id = team_a.id
				LEFT JOIN teams team_b ON m.team_b_id = team_b.id
				LEFT JOIN host ON m.id = host.match_id
				JOIN match_participants mp ON m.id = mp.match_id
				WHERE mp.user_id = ? AND m.status = ?
				ORDER BY host.date_time ASC`,
			[userId, status]
		);

		const combinedMatches = [
			...matchesAsCreator,
			...matchesAsPlayer.filter(
				(match) => !matchesAsCreator.some((m) => m.id === match.id)
			),
		];

		res.json(combinedMatches);
	} catch (error) {
		console.error("Error getting matches by status:", error);
		res.status(500).json({ message: "Error getting matches by status." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Get Match by ID
//
export const getMatchById = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Match ID from request parameters
		const matchId = req.params.matchId;

		// Query to get the match details
		const [match] = await connection.query(
			`SELECT m.*,
					team_a.name AS team_a_name, team_a.logo_url AS team_a_logo, team_a.created_at AS team_a_created_at,
					team_b.name AS team_b_name, team_b.logo_url AS team_b_logo, team_b.created_at AS team_b_created_at
				FROM matches m
				LEFT JOIN teams team_a ON m.team_a_id = team_a.id
				LEFT JOIN teams team_b ON m.team_b_id = team_b.id
				WHERE m.id = ?`,
			[matchId]
		);

		// Send the structured response
		res.json(match[0]);
	} catch (error) {
		console.error("Error getting match by ID:", error);
		res.status(500).json({ message: "Error getting match by ID." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to create a match
//
export const createMatch = async (req, res) => {
	let connection;
	try {
		// Extracting data from request body
		const { pitchId, userId, matchDate } = req.body;

		// Get a connection from the pool
		connection = await getConnection();

		// Start a transaction to ensure atomicity
		await connection.beginTransaction();

		// Check if the user exists
		const [user] = await connection.query(
			"SELECT id FROM users WHERE id = ?",
			[userId]
		);
		if (user.length === 0) {
			throw new Error("User does not exist.");
		}

		// Check if the pitch is available at the requested date and time
		const [existingOccupancy] = await connection.query(
			"SELECT pitch_id, date_time FROM host WHERE pitch_id = ? AND date_time = ?",
			[pitchId, matchDate]
		);
		if (existingOccupancy.length > 0) {
			throw new Error(
				"The selected pitch is already reserved at this date and time."
			);
		}

		// Generate unique names and short names for teams
		const generateTeamName = (prefix) =>
			`${prefix} ${crypto.randomBytes(3).toString("hex")}`; // e.g., Team 4b5f23
		const generateShortName = () =>
			crypto.randomBytes(2).toString("hex").toUpperCase(); // e.g., 4B5F

		const teamAName = generateTeamName("Team A");
		const teamAShortName = generateShortName();
		const teamBName = generateTeamName("Team B");
		const teamBShortName = generateShortName();

		// Insert Team A
		const [teamA] = await connection.query(
			`INSERT INTO teams (name, short_name, created_by_user_id) VALUES (?, ?, ?)`,
			[teamAName, teamAShortName, userId]
		);

		// Insert Team B
		const [teamB] = await connection.query(
			`INSERT INTO teams (name, short_name, created_by_user_id) VALUES (?, ?, ?)`,
			[teamBName, teamBShortName, userId]
		);

		// Insert Match (without match_date)
		const [match] = await connection.query(
			`INSERT INTO matches (team_a_id, team_b_id, created_by_user_id) VALUES (?, ?, ?)`,
			[teamA.insertId, teamB.insertId, userId]
		);

		// Insert the occupancy in host to mark the pitch as reserved
		await connection.query(
			`INSERT INTO host (pitch_id, date_time, match_id) VALUES (?, ?, ?)`,
			[pitchId, matchDate, match.insertId]
		);

		// Commit the transaction
		await connection.commit();

		// Send the response with match details
		res.status(201).json({
			message: "Match created successfully",
			matchId: match.insertId,
			pitchId: pitchId,
			teamAId: teamA.insertId,
			teamBId: teamB.insertId,
			matchDate: matchDate,
			status: "scheduled",
		});
	} catch (error) {
		if (connection) await connection.rollback(); // Rollback on error

		// Handle specific errors
		if (error.message === "User does not exist.") {
			res.status(400).json({ message: "User does not exist." });
		} else if (
			error.message ===
			"The selected pitch is already reserved at this date and time."
		) {
			res.status(400).json({
				message:
					"The selected pitch is already reserved at this date and time.",
			});
		} else {
			console.error("Error creating match:", error);
			res.status(500).json({ message: "Error creating match." });
		}
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to cancel a match
//
export const cancelMatch = async (req, res) => {
	let connection;
	try {
		// Extracting data from request body
		const { matchId } = req.body;

		// Get a connection from the pool
		connection = await getConnection();

		// Start a transaction to ensure atomicity
		await connection.beginTransaction();

		// Check if the match exists
		const [match] = await connection.query(
			"SELECT id, match_date, status FROM matches WHERE id = ?",
			[matchId]
		);
		if (match.length === 0) {
			throw new Error("Match does not exist.");
		}

		// Check if the match is already canceled
		if (match[0].status === "canceled") {
			throw new Error("Match is already canceled.");
		}

		// Update the match status to 'canceled'
		await connection.query(
			"UPDATE matches SET status = 'canceled' WHERE id = ?",
			[matchId]
		);

		// Remove the occupancy from host
		await connection.query("DELETE FROM host WHERE match_id = ?", [matchId]);

		// Commit the transaction
		await connection.commit();

		// Send the response with cancellation details
		res.status(200).json({
			message: "Match canceled successfully",
			matchId: matchId,
			status: "canceled",
		});
	} catch (error) {
		if (connection) await connection.rollback(); // Rollback on error

		// Handle specific errors
		if (error.message === "Match does not exist.") {
			res.status(400).json({ message: "Match does not exist." });
		} else if (error.message === "Match is already canceled.") {
			res.status(400).json({ message: "Match is already canceled." });
		} else {
			console.error("Error canceling match:", error);
			res.status(500).json({ message: "Error canceling match." });
		}
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get participants of a match
//
export const getMatchParticipants = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Match ID from request parameters
		const matchId = req.params.match_id;

		// Get the participants of the match
		const [participants] = await connection.query(
			`SELECT u.id, u.username, u.email, u.photo, mp.team_id 
										FROM users u 
										INNER JOIN match_participants mp 
										ON u.id = mp.user_id 
										WHERE mp.match_id = ?`,
			[matchId]
		);

		// Send the response with the participants
		res.json(participants);
	} catch (error) {
		console.error("Error getting match participants:", error);
		res.status(500).json({ message: "Error getting match participants." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

// Add participant to a match
export const addMatchParticipant = async (req, res) => {
	let connection;
	try {
		// Extracting data from request body
		const { matchId, userId } = req.body;

		// Get a connection from the pool
		connection = await getConnection();

		// Check if the user exists
		const [user] = await connection.query(
			"SELECT id FROM users WHERE id = ?",
			[userId]
		);
		if (user.length === 0) {
			return res.status(404).json({ message: "User does not exist." });
		}

		// Check if the match exists
		const [match] = await connection.query(
			"SELECT id FROM matches WHERE id = ?",
			[matchId]
		);
		if (match.length === 0) {
			return res.status(404).json({ message: "Match does not exist." });
		}

		// Check if the user is already a participant in the match
		const [existingParticipant] = await connection.query(
			"SELECT id FROM match_participants WHERE match_id = ? AND user_id = ?",
			[matchId, userId]
		);
		if (existingParticipant.length > 0) {
			return res.status(400).json({
				message: "User is already a participant in the match.",
			});
		}

		// Insert the participant in match_participants with team_id as NULL
		const [insertResult] = await connection.query(
			"INSERT INTO match_participants (match_id, user_id, team_id) VALUES (?, ?, NULL)",
			[matchId, userId]
		);

		// Send the success response with participant details
		res.status(201).json({
			message: "Participant added successfully",
			participant: {
				matchId,
				userId,
				participantId: insertResult.insertId,
				teamId: null,
			},
		});
	} catch (error) {
		console.error("Error adding participant to match:", error);
		res.status(500).json({ message: "Error adding participant to match." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

// Remove participant from a match
export const deleteMatchParticipant = async (req, res) => {
	let connection;
	try {
		// Extract matchId and userId from the request body
		const { matchId, userId } = req.body;

		// Get a connection from the pool
		connection = await getConnection();

		// Check if the participant exists in the match
		const [participant] = await connection.query(
			"SELECT id FROM match_participants WHERE match_id = ? AND user_id = ?",
			[matchId, userId]
		);
		if (participant.length === 0) {
			return res
				.status(404)
				.json({ message: "Participant not found in the match." });
		}

		// Delete the participant from the match
		await connection.query(
			"DELETE FROM match_participants WHERE match_id = ? AND user_id = ?",
			[matchId, userId]
		);

		// Send a success response
		res.status(200).json({ message: "Participant removed successfully." });
	} catch (error) {
		console.error("Error removing participant from match:", error);
		res.status(500).json({
			message: "Error removing participant from match.",
		});
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get invitations of a match
//
export const getMatchInvitations = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Match ID from request parameters
		const matchId = req.params.match_id;

		// Get the invitations of the match
		const [invitations] = await connection.query(
			`SELECT u.id, u.username, u.email, u.photo, mi.status 
											FROM users u 
											INNER JOIN match_invitations mi 
											ON u.id = mi.user_id 
											WHERE mi.match_id = ?`,
			[matchId]
		);

		// Send the response with the invitations
		res.json(invitations);
	} catch (error) {
		console.error("Error getting match invitations:", error);
		res.status(500).json({ message: "Error getting match invitations." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to add an invitation to a match
//
export const addMatchInvitation = async (req, res) => {
	console.log("Received Invitation Request:", req.body);
	let connection;
	try {
		// Get matchId, userId, and senderId from request body
		const { matchId, userId, senderId } = req.body;

		// Get a connection from the pool
		connection = await getConnection();

		// Check if the user exists
		const [user] = await connection.query(
			"SELECT id FROM users WHERE id = ?",
			[userId]
		);
		if (user.length === 0) {
			throw new Error("User does not exist.");
		}

		// Check if the match exists
		const [match] = await connection.query(
			"SELECT id, created_by_user_id FROM matches WHERE id = ?",
			[matchId]
		);
		if (match.length === 0) {
			throw new Error("Match does not exist.");
		}

		// Check if the user is the creator of the match
		if (match[0].created_by_user_id === userId) {
			throw new Error("User is the creator of the match.");
		}

		// Check if the user is already a participant in the match
		const [participant] = await connection.query(
			"SELECT id FROM match_participants WHERE match_id = ? AND user_id = ?",
			[matchId, userId]
		);
		if (participant.length > 0) {
			throw new Error("User is already a participant in the match.");
		}

		// Check if the invitation already exists for this match and user
		const [existingInvitation] = await connection.query(
			"SELECT id FROM match_invitations WHERE match_id = ? AND user_id = ? AND status = 'pending'",
			[matchId, userId]
		);
		if (existingInvitation.length > 0) {
			throw new Error("Invitation already exists for this user.");
		}

		// Insert the invitation with status 'pending'
		await connection.query(
			"INSERT INTO match_invitations (match_id, user_id, status, sender_id) VALUES (?, ?, 'pending', ?)",
			[matchId, userId, senderId]
		);

		// Send the success response
		res.status(201).json({
			message: "Invitation sent successfully",
			matchId: matchId,
			userId: userId,
			senderId: senderId,
		});
	} catch (error) {
		// Handle specific errors
		if (error.message === "User does not exist.") {
			res.status(400).json({ message: "User does not exist." });
		} else if (error.message === "Match does not exist.") {
			res.status(400).json({ message: "Match does not exist." });
		} else if (error.message === "User is the creator of the match.") {
			res.status(400).json({ message: "User is the creator of the match." });
		} else if (
			error.message === "User is already a participant in the match."
		) {
			res.status(400).json({
				message: "User is already a participant in the match.",
			});
		} else if (error.message === "Invitation already exists for this user.") {
			res.status(400).json({
				message: "Invitation already exists for this user.",
			});
		} else {
			// Handle any unexpected errors
			console.error("Error adding invitation to match:", error);
			res.status(500).json({ message: "Error adding invitation to match." });
		}
	} finally {
		// Release the database connection back to the pool
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Function to delete an invitation to a match
//
export const deleteMatchInvitation = async (req, res) => {
	let connection;
	try {
		// Get matchId and userId from request body or params
		const { matchId, userId } = req.params;

		// Get a connection from the pool
		connection = await getConnection();

		// Check if the invitation exists
		const [invitation] = await connection.query(
			"SELECT id FROM match_invitations WHERE match_id = ? AND user_id = ?",
			[matchId, userId]
		);
		if (invitation.length === 0) {
			throw new Error("Invitation does not exist.");
		}

		// Delete the invitation
		await connection.query(
			"DELETE FROM match_invitations WHERE match_id = ? AND user_id = ?",
			[matchId, userId]
		);

		// Send the response
		res.status(200).json({
			message: "Invitation deleted successfully",
			matchId: matchId,
			userId: userId,
		});
	} catch (error) {
		// Handle specific errors
		if (error.message === "Invitation does not exist.") {
			res.status(400).json({ message: "Invitation does not exist." });
		} else {
			console.error("Error deleting invitation from match:", error);
			res.status(500).json({
				message: "Error deleting invitation from match.",
			});
		}
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to accept an invitation to a match and add participant
//
export const acceptMatchInvitation = async (req, res) => {
	let connection;
	try {
		// Get matchId and userId from request body
		const { matchId, userId } = req.body;

		// Get a connection from the pool
		connection = await getConnection();

		// Check if the invitation exists
		const [invitation] = await connection.query(
			"SELECT id FROM match_invitations WHERE match_id = ? AND user_id = ? AND status = 'pending'",
			[matchId, userId]
		);
		if (invitation.length === 0) {
			throw new Error("Invitation does not exist.");
		}

		// Update the invitation status to 'accepted'
		await connection.query(
			"UPDATE match_invitations SET status = 'accepted' WHERE match_id = ? AND user_id = ? AND status = 'pending'",
			[matchId, userId]
		);

		// Check if the user is already a participant in the match
		const [existingParticipant] = await connection.query(
			"SELECT id FROM match_participants WHERE match_id = ? AND user_id = ?",
			[matchId, userId]
		);
		if (existingParticipant.length === 0) {
			// Insert the user into the match_participants table with team_id as null and is_leader as false
			await connection.query(
				"INSERT INTO match_participants (match_id, user_id, team_id, is_leader) VALUES (?, ?, NULL, false)",
				[matchId, userId]
			);
		}

		// Send the response
		res.status(200).json({
			message: "Invitation accepted and participant added successfully",
			matchId: matchId,
			userId: userId,
		});
	} catch (error) {
		// Handle specific errors
		if (error.message === "Invitation does not exist.") {
			res.status(400).json({ message: "Invitation does not exist." });
		} else {
			console.error("Error accepting invitation:", error);
			res.status(500).json({ message: "Error accepting invitation." });
		}
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to reject an invitation to a match
//
export const rejectMatchInvitation = async (req, res) => {
	let connection;
	try {
		// Get matchId and userId from request body
		const { matchId, userId } = req.body;

		// Get a connection from the pool
		connection = await getConnection();

		// Check if the invitation exists
		const [invitation] = await connection.query(
			"SELECT id FROM match_invitations WHERE match_id = ? AND user_id = ? AND status = 'pending'",
			[matchId, userId]
		);
		if (invitation.length === 0) {
			throw new Error("Invitation does not exist.");
		}

		// Update the invitation status to 'rejected'
		await connection.query(
			"UPDATE match_invitations SET status = 'rejected' WHERE match_id = ? AND user_id = ?",
			[matchId, userId]
		);

		// Send the response
		res.status(200).json({
			message: "Invitation rejected successfully",
			matchId: matchId,
			userId: userId,
		});
	} catch (error) {
		// Handle specific errors
		if (error.message === "Invitation does not exist.") {
			res.status(400).json({ message: "Invitation does not exist." });
		} else {
			console.error("Error rejecting invitation:", error);
			res.status(500).json({ message: "Error rejecting invitation." });
		}
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to change status
//
export const changeMatchStatus = async (req, res) => {
	let connection;
	try {
		// Get matchId and status from request body
		const { matchId, status } = req.body;

		// Allowed status values
		const allowedStatuses = ["scheduled", "completed", "canceled"];

		// Validate the status
		if (!allowedStatuses.includes(status)) {
			return res.status(400).json({
				message:
					"Invalid status. Allowed values are 'scheduled', 'completed', or 'canceled'.",
			});
		}

		// Get a connection from the pool
		connection = await getConnection();

		// Check if the match exists
		const [match] = await connection.query(
			"SELECT id FROM matches WHERE id = ?",
			[matchId]
		);

		if (match.length === 0) {
			throw new Error("Match does not exist.");
		}

		// Update the match status
		await connection.query("UPDATE matches SET status = ? WHERE id = ?", [
			status,
			matchId,
		]);

		// Send the response
		res.status(200).json({
			message: "Match status updated successfully",
			matchId: matchId,
			status: status,
		});
	} catch (error) {
		// Handle specific errors
		if (error.message === "Match does not exist.") {
			res.status(404).json({ message: "Match does not exist." });
		} else {
			console.error("Error updating match status:", error);
			res.status(500).json({ message: "Error updating match status." });
		}
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to change match access type
//
export const changeMatchAccessType = async (req, res) => {
	let connection;
	try {
		// Get matchId and accessType from request body
		const { matchId, accessType } = req.body;

		// Allowed access type values
		const allowedAccessTypes = ["public", "private"];

		// Validate the access type
		if (!allowedAccessTypes.includes(accessType)) {
			return res.status(400).json({
				message:
					"Invalid access type. Allowed values are 'public' or 'private'.",
			});
		}

		// Get a connection from the pool
		connection = await getConnection();

		// Check if the match exists
		const [match] = await connection.query(
			"SELECT id FROM matches WHERE id = ?",
			[matchId]
		);

		if (match.length === 0) {
			throw new Error("Match does not exist.");
		}

		// Update the match access type
		await connection.query(
			"UPDATE matches SET access_type = ? WHERE id = ?",
			[accessType, matchId]
		);

		// Send the response
		res.status(200).json({
			message: "Match access type updated successfully",
			matchId: matchId,
			accessType: accessType,
		});
	} catch (error) {
		// Handle specific errors
		if (error.message === "Match does not exist.") {
			res.status(404).json({ message: "Match does not exist." });
		} else {
			console.error("Error updating match access type:", error);
			res.status(500).json({ message: "Error updating match access type." });
		}
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get matches by access type
//
export const getMatchesByAccessType = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { accessType } = req.params;

		const allowedAccessTypes = ["public", "private"];
		if (!allowedAccessTypes.includes(accessType)) {
			console.log("Invalid access type provided:", accessType);
			return res.status(400).json({
				message:
					"Invalid access type. Allowed values are 'public' or 'private'.",
			});
		}

		// First query to get match details
		const [matches] = await connection.query(
			`SELECT m.*, host.date_time AS match_date, host.pitch_id,
				team_a.name AS team_a_name, team_a.logo_url AS team_a_logo,
				team_b.name AS team_b_name, team_b.logo_url AS team_b_logo
			 FROM matches m
			 LEFT JOIN teams team_a ON m.team_a_id = team_a.id
			 LEFT JOIN teams team_b ON m.team_b_id = team_b.id
			 LEFT JOIN host ON m.id = host.match_id
			 WHERE m.access_type = ?
			 ORDER BY host.date_time ASC`,
			[accessType]
		);

		// Ensure there are matches before proceeding
		if (matches.length === 0) {
			return res.json([]);
		}

		// Collect unique pitch IDs
		const pitchIds = [...new Set(matches.map((match) => match.pitch_id))];

		// Second query to get center details
		const [centerData] = await connection.query(
			`SELECT p.id AS pitch_id, c.title AS center_name, c.address
			 FROM pitches p
			 LEFT JOIN centers c ON p.center_id = c.id
			 WHERE p.id IN (?)`,
			[pitchIds]
		);

		// Map center data
		const centerMap = centerData.reduce((map, center) => {
			map[center.pitch_id] = {
				center_name: center.center_name,
				address: center.address,
			};
			return map;
		}, {});

		// Attach center information to each match
		const enrichedMatches = matches.map((match) => ({
			...match,
			center_name:
				centerMap[match.pitch_id]?.center_name || "Center not available",
			address: centerMap[match.pitch_id]?.address || "Address not available",
		}));

		res.json(enrichedMatches);
	} catch (error) {
		console.error("Error getting matches by access type:", error); // Detailed error
		res.status(500).json({
			message: "Error getting matches by access type.",
		});
	} finally {
		if (connection) connection.release();
	}
};
