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
		const { name, start_date, end_date, created_by_user_id } = req.body;
		const logo_url =
			req.body.logo_url ||
			"https://e7.pngegg.com/pngimages/151/231/png-clipart-logo-football-football-logo-blue-other-thumbnail.png";

		console.log("Creating competition with data:", req.body);

		const [result] = await connection.query(
			`INSERT INTO competitions (name, start_date, end_date, status, logo_url, created_by) VALUES (?, ?, ?, 'scheduled', ?, ?)`,
			[name, start_date, end_date, logo_url, created_by_user_id]
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
		const { name } = req.body;

		// Obtener los valores actuales de la competición
		const [currentCompetition] = await connection.query(
			`SELECT start_date, end_date, status, logo_url FROM competitions WHERE id = ?`,
			[competitionId]
		);

		if (currentCompetition.length === 0) {
			return res.status(404).json({ message: "Competition not found." });
		}

		// Establecer valores por defecto usando los existentes si no se proporcionan en la solicitud
		const start_date =
			req.body.start_date || currentCompetition[0].start_date;
		const end_date = req.body.end_date || currentCompetition[0].end_date;
		const status = req.body.status || currentCompetition[0].status;
		const logo_url = req.body.logo_url || currentCompetition[0].logo_url;

		// Actualizar la competición
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

		// Obtener las fechas de la competición y verificar si ya se realizó el sorteo
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

		// Obtener los equipos en la competición
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

		// Generar lista de fechas entre start_date y end_date
		let currentDate = new Date(start_date);
		const endDate = new Date(end_date);
		while (currentDate <= endDate) {
			availableDates.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		// Obtener canchas activas y reservaciones existentes
		const [pitches] = await connection.query(
			`SELECT id FROM pitches WHERE status = 'active'`
		);
		const availablePitches = pitches.map((p) => p.id);

		const [reservations] = await connection.query(
			`SELECT pitch_id, date_time FROM host WHERE pitch_id IN (?)`,
			[availablePitches]
		);

		let lastAssignedDateIndex = 0;

		// Generar partidos de ida y vuelta para cada equipo y distribuirlos en diferentes fechas
		for (let i = 0; i < teamIds.length; i++) {
			for (let j = i + 1; j < teamIds.length; j++) {
				const homeAwayMatches = [
					{ team_a_id: teamIds[i], team_b_id: teamIds[j] },
					{ team_a_id: teamIds[j], team_b_id: teamIds[i] },
				];

				for (let match of homeAwayMatches) {
					let reserved = false;

					// Asignar la siguiente fecha disponible para este partido
					while (lastAssignedDateIndex < availableDates.length) {
						const date = availableDates[lastAssignedDateIndex];
						lastAssignedDateIndex++;

						const dateFormatted = date.toISOString().split("T")[0];

						// Verificar que ninguno de los equipos tenga otro partido el mismo día
						const teamHasMatchOnDate = reservedMatches.some(
							(reservedMatch) =>
								reservedMatch.date === dateFormatted &&
								(reservedMatch.team_a_id === match.team_a_id ||
									reservedMatch.team_b_id === match.team_b_id)
						);

						if (teamHasMatchOnDate) continue; // Si alguno de los equipos ya tiene un partido ese día, saltamos a la siguiente fecha

						// Intentar reservar la cancha y el horario
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

								// Verificar si la cancha y el horario están disponibles
								const isAvailable = !reservations.some(
									(res) =>
										res.pitch_id === pitchId &&
										res.date_time === reservationFormatted
								);

								if (isAvailable) {
									// Crear partido y reservar slot, asignando al creador de la competición
									const [result] = await connection.query(
										`INSERT INTO matches (team_a_id, team_b_id, status, created_by_user_id) VALUES (?, ?, 'scheduled', ?)`,
										[match.team_a_id, match.team_b_id, created_by]
									);
									await connection.query(
										`INSERT INTO host (pitch_id, date_time, match_id) VALUES (?, ?, ?)`,
										[pitchId, reservationFormatted, result.insertId]
									);

									// Registrar el partido reservado
									reserved = true;
									reservedMatches.push({
										id: result.insertId,
										date: dateFormatted,
										team_a_id: match.team_a_id,
										team_b_id: match.team_b_id,
									});
									reservations.push({
										pitch_id: pitchId,
										date_time: reservationFormatted,
									});
									break;
								}
							}
						}

						if (reserved) break;
					}

					if (!reserved) {
						console.warn(
							`No available slots for match between team ${match.team_a_id} and team ${match.team_b_id}`
						);
					}
				}
			}
		}

		// Marcar la competición como "draw" completado
		await connection.query(
			`UPDATE competitions SET is_draw = true WHERE id = ?`,
			[competitionId]
		);

		res.json({
			message: "Matches created and slots reserved successfully",
			matches: reservedMatches.map((match) => match.id),
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

///////////////////////////////////////////////////////////////////
// Get Teams in a Competition
//
export const getCompetitionTeams = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const competitionId = req.params.id;

		// Query to retrieve teams in the competition
		const [teams] = await connection.query(
			`SELECT t.id, t.name, t.short_name, t.logo_url 
			 FROM teams t
			 JOIN comp_teams ct ON t.id = ct.team_id
			 WHERE ct.competition_id = ?`,
			[competitionId]
		);

		if (teams.length === 0) {
			return res
				.status(404)
				.json({ message: "No teams found for this competition." });
		}

		res.json({ teams });
	} catch (error) {
		console.error("Error retrieving teams for competition:", error);
		res.status(500).json({ message: "Error retrieving teams." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Get Competitions by User
//
export const getCompetitionsByUser = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const userId = req.params.userId;

		// Query to fetch competitions created by the user
		const [competitions] = await connection.query(
			`SELECT * FROM competitions WHERE created_by = ?`,
			[userId]
		);

		if (competitions.length === 0) {
			return res
				.status(404)
				.json({ message: "No competitions found for this user." });
		}

		res.json(competitions);
	} catch (error) {
		console.error("Error retrieving competitions by user:", error);
		res.status(500).json({ message: "Error retrieving competitions." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Get all competitions
//
export const getAllCompetitions = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const [competitions] = await connection.query(
			`SELECT * FROM competitions`
		);

		res.json(competitions); // Return the list of all competitions
	} catch (error) {
		console.error("Error retrieving all competitions:", error);
		res.status(500).json({ message: "Error retrieving competitions." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Get all custom teams not in a specific competition
//
export const getCustomTeamsNotInCompetition = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const competitionId = req.params.competitionId;

		console.log("Getting custom teams not in competition:", competitionId);

		// Consulta para obtener equipos personalizados que no están en la competición
		const [teams] = await connection.query(
			`SELECT * FROM teams 
			 WHERE is_custom_team = 1 
			 AND id NOT IN (SELECT team_id FROM comp_teams WHERE competition_id = ?)`,
			[competitionId]
		);

		res.json(teams);
	} catch (error) {
		console.error("Error retrieving custom teams not in competition:", error);
		res.status(500).json({ message: "Error retrieving custom teams." });
	} finally {
		if (connection) connection.release();
	}
};

// Get Matches for a Competition
export const getCompetitionMatches = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const competitionId = req.params.id;

		// Check if the competition exists
		const [competition] = await connection.query(
			`SELECT id FROM competitions WHERE id = ?`,
			[competitionId]
		);

		if (competition.length === 0) {
			return res.status(404).json({ message: "Competition not found." });
		}

		// Retrieve matches for the competition along with team names and reservation details
		const [matches] = await connection.query(
			`SELECT 
					m.id AS match_id,
					ta.name AS team_a,
					tb.name AS team_b,
					m.status,
					h.pitch_id,
					h.date_time
			  FROM matches m
			  JOIN teams ta ON m.team_a_id = ta.id
			  JOIN teams tb ON m.team_b_id = tb.id
			  JOIN host h ON m.id = h.match_id
			  WHERE ta.id IN (SELECT team_id FROM comp_teams WHERE competition_id = ?)
			  AND tb.id IN (SELECT team_id FROM comp_teams WHERE competition_id = ?)
			  ORDER BY h.date_time ASC`,
			[competitionId, competitionId]
		);

		res.json({
			message: "Matches retrieved successfully",
			matches: matches,
		});
	} catch (error) {
		console.error("Error retrieving matches:", error);
		res.status(500).json({
			message: "Error retrieving matches.",
		});
	} finally {
		if (connection) connection.release();
	}
};
