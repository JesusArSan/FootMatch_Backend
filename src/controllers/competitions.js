import { getConnection } from "../database.js";

const allSlots = [
	"08:30 AM",
	"09:30 AM",
	"10:30 AM",
	"11:30 AM",
	"12:30 PM",
	"01:30 PM",
	"02:30 PM",
	"03:30 PM",
	"04:30 PM",
	"05:30 PM",
	"06:30 PM",
	"07:30 PM",
	"08:30 PM",
];

///////////////////////////////////////////////////////////////////
// Create Competition
//
export const createCompetition = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { name, start_date, end_date, status, logo_url, created_by } =
			req.body;

		const [result] = await connection.query(
			`INSERT INTO competitions (name, start_date, end_date, status, logo_url, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
			[name, start_date, end_date, status, logo_url, created_by]
		);

		res.json({
			message: "Competition created successfully",
			competitionId: result.insertId,
		});
	} catch (error) {
		console.error("Error creating competition:", error);
		res.status(500).json({ message: "Error creating competition." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Get Competition by ID with Teams
//
export const getCompetitionById = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const competitionId = req.params.id;

		// Query to get competition details and associated teams
		const [competition] = await connection.query(
			`SELECT 
               c.*, 
               JSON_ARRAYAGG(JSON_OBJECT('team_id', t.id, 'name', t.name, 'short_name', t.short_name, 'logo_url', t.logo_url)) AS teams
           FROM competitions c
           LEFT JOIN comp_teams ct ON c.id = ct.competition_id
           LEFT JOIN teams t ON ct.team_id = t.id
           WHERE c.id = ?
           GROUP BY c.id`,
			[competitionId]
		);

		if (competition.length === 0) {
			return res.status(404).json({ message: "Competition not found." });
		}

		res.json(competition[0]);
	} catch (error) {
		console.error("Error retrieving competition by ID:", error);
		res.status(500).json({ message: "Error retrieving competition." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Update Competition
//
export const updateCompetition = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const competitionId = req.params.id;
		const { name, start_date, end_date, status, logo_url } = req.body;

		const [result] = await connection.query(
			`UPDATE competitions SET name = ?, start_date = ?, end_date = ?, status = ?, logo_url = ? WHERE id = ?`,
			[name, start_date, end_date, status, logo_url, competitionId]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Competition not found." });
		}

		res.json({ message: "Competition updated successfully" });
	} catch (error) {
		console.error("Error updating competition:", error);
		res.status(500).json({ message: "Error updating competition." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Delete Competition
//
export const deleteCompetition = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const competitionId = req.params.id;

		const [result] = await connection.query(
			`DELETE FROM competitions WHERE id = ?`,
			[competitionId]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Competition not found." });
		}

		res.json({ message: "Competition deleted successfully" });
	} catch (error) {
		console.error("Error deleting competition:", error);
		res.status(500).json({ message: "Error deleting competition." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Add Team to Competition
//
export const addTeamToCompetition = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { team_id, competition_id } = req.body;

		// Check the current count of teams in the competition
		const [countResult] = await connection.query(
			`SELECT COUNT(*) AS teamCount FROM comp_teams WHERE competition_id = ?`,
			[competition_id]
		);

		const { teamCount } = countResult[0];

		if (teamCount >= 20) {
			return res.status(400).json({
				message: "Maximum of 20 teams reached for this competition.",
			});
		}

		// Add team to competition
		await connection.query(
			`INSERT INTO comp_teams (team_id, competition_id) VALUES (?, ?)`,
			[team_id, competition_id]
		);

		res.json({ message: "Team added to competition successfully" });
	} catch (error) {
		console.error("Error adding team to competition:", error);
		res.status(500).json({ message: "Error adding team to competition." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Remove Team from Competition
//
export const removeTeamFromCompetition = async (req, res) => {
	let connection;
	try {
		// Get comp_id and team_id from URL params
		let { comp_id, team_id } = req.params;

		// Convert to numbers and validate
		comp_id = Number(comp_id);
		team_id = Number(team_id);

		if (isNaN(comp_id) || isNaN(team_id)) {
			return res
				.status(400)
				.json({ message: "comp_id and team_id must be numbers." });
		}

		connection = await getConnection();

		const [result] = await connection.query(
			`DELETE FROM comp_teams WHERE team_id = ? AND competition_id = ?`,
			[team_id, comp_id]
		);

		if (result.affectedRows === 0) {
			return res
				.status(404)
				.json({ message: "Team not found in competition." });
		}

		res.json({ message: "Team removed from competition successfully" });
	} catch (error) {
		console.error("Error removing team from competition:", error);
		res.status(500).json({
			message: "Error removing team from competition.",
		});
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Draw Teams and Reserve Slots for a Competition
//
export const generateMatchesAndReserve = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const competitionId = req.params.id;

		// Get competition dates and check if draw has been done
		const [competition] = await connection.query(
			`SELECT start_date, end_date, is_draw, created_by FROM competitions WHERE id = ?`,
			[competitionId]
		);

		if (competition.length === 0) {
			return res.status(404).json({ message: "Competition not found." });
		}

		const { start_date, end_date, is_draw, created_by } = competition[0];

		if (is_draw) {
			return res.status(400).json({
				message: "Draw has already been completed for this competition.",
			});
		}

		// Get teams in the competition
		const [teams] = await connection.query(
			`SELECT t.id FROM teams t
            JOIN comp_teams ct ON t.id = ct.team_id
            WHERE ct.competition_id = ?`,
			[competitionId]
		);

		if (teams.length < 2) {
			return res.status(400).json({
				message: "Not enough teams to create matches.",
			});
		}

		const teamIds = teams.map((team) => team.id);
		const reservedMatches = [];
		const availableDates = [];

		// Generate list of dates between start_date and end_date
		let currentDate = new Date(start_date);
		const endDate = new Date(end_date);
		while (currentDate <= endDate) {
			availableDates.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		// Get active pitches and existing reservations
		const [pitches] = await connection.query(
			`SELECT id FROM pitches WHERE status = 'active'`
		);
		const availablePitches = pitches.map((p) => p.id);

		const [reservations] = await connection.query(
			`SELECT pitch_id, date_time FROM host WHERE pitch_id IN (?)`,
			[availablePitches]
		);

		// Generate home and away matches for each team
		for (let i = 0; i < teamIds.length; i++) {
			for (let j = i + 1; j < teamIds.length; j++) {
				const homeAwayMatches = [
					{ team_a_id: teamIds[i], team_b_id: teamIds[j] },
					{ team_a_id: teamIds[j], team_b_id: teamIds[i] },
				];

				for (let match of homeAwayMatches) {
					let reserved = false;

					for (let date of availableDates) {
						if (reserved) break;

						for (let pitchId of availablePitches) {
							if (reserved) break;

							for (let slot of allSlots) {
								const [hours, minutes] = slot.split(/[:\s]/);
								const ampm = slot.slice(-2);
								const hour =
									ampm === "PM" && hours !== "12"
										? parseInt(hours) + 12
										: parseInt(hours);

								const reservationDateTime = new Date(date);
								reservationDateTime.setHours(hour, minutes, 0, 0);
								if (isNaN(reservationDateTime)) continue;

								const reservationFormatted = reservationDateTime
									.toISOString()
									.slice(0, 19)
									.replace("T", " ");

								// Check if the pitch and slot are available
								const isAvailable = !reservations.some(
									(res) =>
										res.pitch_id === pitchId &&
										res.date_time === reservationFormatted
								);

								if (isAvailable) {
									// Create match and reserve slot, assigning the creator of the competition
									const [result] = await connection.query(
										`INSERT INTO matches (team_a_id, team_b_id, status, created_by_user_id) VALUES (?, ?, 'scheduled', ?)`,
										[match.team_a_id, match.team_b_id, created_by]
									);
									await connection.query(
										`INSERT INTO host (pitch_id, date_time, match_id) VALUES (?, ?, ?)`,
										[pitchId, reservationFormatted, result.insertId]
									);

									reserved = true;
									reservedMatches.push(result.insertId);
									reservations.push({
										pitch_id: pitchId,
										date_time: reservationFormatted,
									});
									break;
								}
							}
						}
					}

					if (!reserved) {
						console.warn(
							`No available slots for match between team ${match.team_a_id} and team ${match.team_b_id}`
						);
					}
				}
			}
		}

		// Update competition to indicate draw is complete
		await connection.query(
			`UPDATE competitions SET is_draw = true WHERE id = ?`,
			[competitionId]
		);

		res.json({
			message: "Matches created and slots reserved successfully",
			matches: reservedMatches,
		});
	} catch (error) {
		console.error("Error generating matches and reservations:", error);
		res.status(500).json({
			message: "Error generating matches and reservations.",
		});
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Delete All Matches for a Competition
//
export const deleteCompetitionMatches = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const competitionId = req.params.id;

		// Check if competition exists
		const [competition] = await connection.query(
			`SELECT id FROM competitions WHERE id = ?`,
			[competitionId]
		);

		if (competition.length === 0) {
			return res.status(404).json({ message: "Competition not found." });
		}

		// Delete matches related to the competition
		await connection.query(
			`DELETE m FROM matches m
            JOIN comp_teams ct ON (m.team_a_id = ct.team_id OR m.team_b_id = ct.team_id)
            WHERE ct.competition_id = ?`,
			[competitionId]
		);

		// Set is_draw to false in competitions
		await connection.query(
			`UPDATE competitions SET is_draw = false WHERE id = ?`,
			[competitionId]
		);

		res.json({
			message:
				"All matches deleted and is_draw set to false for the competition.",
		});
	} catch (error) {
		console.error("Error deleting matches for the competition:", error);
		res.status(500).json({
			message: "Error deleting matches for the competition.",
		});
	} finally {
		if (connection) connection.release();
	}
};
