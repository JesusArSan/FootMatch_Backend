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
		// Get a connection from the pool
		connection = await getConnection();

		// User ID from request parameters
		const userId = req.params.user_id;

		// Query to get matches where the user is the creator of the match
		const [matchesAsCreator] = await connection.query(
			`SELECT m.*,
					team_a.name AS team_a_name, team_a.logo_url AS team_a_logo, team_a.created_at AS team_a_created_at,
					team_b.name AS team_b_name, team_b.logo_url AS team_b_logo, team_b.created_at AS team_b_created_at
				FROM matches m
				LEFT JOIN teams team_a ON m.team_a_id = team_a.id
				LEFT JOIN teams team_b ON m.team_b_id = team_b.id
				WHERE m.created_by_user_id = ?
				ORDER BY team_a.created_at ASC, team_b.created_at ASC`,
			[userId]
		);

		// Query to get matches where the user is a participant in either team
		const [matchesAsPlayer] = await connection.query(
			`SELECT m.*,
					team_a.name AS team_a_name, team_a.logo_url AS team_a_logo, team_a.created_at AS team_a_created_at,
					team_b.name AS team_b_name, team_b.logo_url AS team_b_logo, team_b.created_at AS team_b_created_at
				FROM matches m
				LEFT JOIN teams team_a ON m.team_a_id = team_a.id
				LEFT JOIN teams team_b ON m.team_b_id = team_b.id
				JOIN match_participants mp ON m.id = mp.match_id
				WHERE mp.user_id = ?
				ORDER BY team_a.created_at ASC, team_b.created_at ASC`,
			[userId]
		);

		// Combine results and remove duplicates (in case the user is both the creator and a player in the same match)
		const combinedMatches = [
			...matchesAsCreator,
			...matchesAsPlayer.filter(
				(match) => !matchesAsCreator.some((m) => m.id === match.id)
			),
		];

		// Send the structured response
		res.json(combinedMatches);
	} catch (error) {
		console.error("Error getting matches:", error);
		res.status(500).json({ message: "Error getting matches." });
	} finally {
		if (connection) connection.release(); // Release the connection
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
			"SELECT id FROM pitch_occupancies WHERE pitch_id = ? AND date_time = ?",
			[pitchId, matchDate] // Ensure matchDate is in 'YYYY-MM-DD HH:MM:SS' format
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

		// Insert Team B. The lider will set after the match is created by the user
		const [teamB] = await connection.query(
			`INSERT INTO teams (name, short_name, created_by_user_id) VALUES (?, ?, ?)`,
			[teamBName, teamBShortName, userId]
		);

		// AÑADIR EL LIDER DE LA SALA A LA LISTA DE PARTICIPANTES?????? DEBATIR

		// Insert Match
		const [match] = await connection.query(
			`INSERT INTO matches (pitch_id, team_a_id, team_b_id, match_date, created_by_user_id) VALUES (?, ?, ?, ?, ?)`,
			[pitchId, teamA.insertId, teamB.insertId, matchDate, userId]
		);

		// Insert the occupancy in pitch_occupancies to mark the pitch as reserved
		await connection.query(
			`INSERT INTO pitch_occupancies (pitch_id, date_time) VALUES (?, ?)`,
			[pitchId, matchDate]
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
			"SELECT id, pitch_id, match_date, status FROM matches WHERE id = ?",
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

		// Remove the occupancy from pitch_occupancies
		await connection.query(
			"DELETE FROM pitch_occupancies WHERE pitch_id = ? AND date_time = ?",
			[match[0].pitch_id, match[0].match_date]
		);

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
