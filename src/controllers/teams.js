import { getConnection } from "../database.js";

///////////////////////////////////////////////////////////////////
// TEAMS FUNCTIONS
///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
// Create a new team
//
export const createTeam = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { name, short_name, logo_url, is_custom_team, created_by_user_id } =
			req.body;

		// Check for duplicate team name
		const [existingTeam] = await connection.query(
			"SELECT * FROM teams WHERE name = ?",
			[name]
		);
		if (existingTeam.length > 0) {
			return res.status(409).json({ message: "Team name already in use." });
		}

		const [result] = await connection.query(
			"INSERT INTO teams (name, short_name, logo_url, is_custom_team, created_by_user_id) VALUES (?, ?, ?, ?, ?)",
			[
				name,
				short_name,
				logo_url ||
					"https://espndeportes.espn.com/i/teamlogos/soccer/500/default-team-logo-500.png?h=100&w=100",
				is_custom_team || 0,
				created_by_user_id,
			]
		);

		res.status(201).json({
			message: "Team created successfully",
			teamId: result.insertId,
		});
	} catch (error) {
		console.error("Error creating team:", error);
		res.status(500).json({ message: "Error creating team." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Update an existing team
//
export const updateTeam = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { id } = req.params;
		const { name, short_name, logo_url, is_custom_team } = req.body;

		const fields = [];
		const values = [];

		// Add only non-empty fields to update
		if (name) {
			fields.push("name = ?");
			values.push(name);
		}
		if (short_name) {
			fields.push("short_name = ?");
			values.push(short_name);
		}
		if (logo_url) {
			fields.push("logo_url = ?");
			values.push(logo_url);
		}
		if (typeof is_custom_team === "number") {
			fields.push("is_custom_team = ?");
			values.push(is_custom_team);
		}

		// Return an error if no fields to update
		if (fields.length === 0) {
			return res.status(400).json({ message: "No fields to update." });
		}

		values.push(id);
		const query = `UPDATE teams SET ${fields.join(", ")} WHERE id = ?`;

		const [result] = await connection.query(query, values);

		if (result.affectedRows === 0) {
			return res
				.status(404)
				.json({ message: "Team not found or no changes made." });
		}

		res.json({ message: "Team updated successfully" });
	} catch (error) {
		console.error("Error updating team:", error);
		res.status(500).json({ message: "Error updating team." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Delete a team
//
export const deleteTeam = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { id } = req.params;

		const [result] = await connection.query(
			"DELETE FROM teams WHERE id = ?",
			[id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Team not found." });
		}

		res.json({ message: "Team deleted successfully" });
	} catch (error) {
		console.error("Error deleting team:", error);
		res.status(500).json({ message: "Error deleting team." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Add a user to a team
//
export const addUserToTeam = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { team_id, user_id } = req.params;

		// Check if user already belongs to the team
		const [existingRelation] = await connection.query(
			"SELECT * FROM BelongTeam WHERE user_id = ? AND team_id = ?",
			[user_id, team_id]
		);
		if (existingRelation.length > 0) {
			return res
				.status(409)
				.json({ message: "User already belongs to this team." });
		}

		// Add user to team
		await connection.query(
			"INSERT INTO BelongTeam (user_id, team_id) VALUES (?, ?)",
			[user_id, team_id]
		);

		res.json({ message: "User added to team successfully" });
	} catch (error) {
		console.error("Error adding user to team:", error);
		res.status(500).json({ message: "Error adding user to team." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Remove a user from a team
//
export const removeUserFromTeam = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { team_id, user_id } = req.params;

		const [result] = await connection.query(
			"DELETE FROM BelongTeam WHERE team_id = ? AND user_id = ?",
			[team_id, user_id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "User not found in team." });
		}

		res.json({ message: "User removed from team successfully" });
	} catch (error) {
		console.error("Error removing user from team:", error);
		res.status(500).json({ message: "Error removing user from team." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Get teams created by a user
//
export const getCreatedTeamsByUser = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { user_id } = req.params;

		// Query to get teams created by the user
		const [teams] = await connection.query(
			"SELECT * FROM teams WHERE created_by_user_id = ?",
			[user_id]
		);

		res.json(teams);
	} catch (error) {
		console.error("Error getting teams created by user:", error);
		res.status(500).json({ message: "Error getting teams created by user." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Get teams a user belongs to
//
export const getTeamsByUser = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { user_id } = req.params;

		// Query to get teams the user belongs to
		const [teams] = await connection.query(
			`SELECT t.* FROM teams t
			 JOIN BelongTeam bt ON t.id = bt.team_id
			 WHERE bt.user_id = ?`,
			[user_id]
		);

		res.json(teams);
	} catch (error) {
		console.error("Error getting teams for user:", error);
		res.status(500).json({ message: "Error getting teams for user." });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Get users in a team
//
export const getTeamUsers = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
		const { team_id } = req.params;

		// Query to get users in the specified team
		const [users] = await connection.query(
			`SELECT u.id, u.name, u.email, u.username, u.photo, bt.joined_at
			 FROM users u
			 JOIN BelongTeam bt ON u.id = bt.user_id
			 WHERE bt.team_id = ?`,
			[team_id]
		);

		res.json(users);
	} catch (error) {
		console.error("Error getting team users:", error);
		res.status(500).json({ message: "Error getting team users." });
	} finally {
		if (connection) connection.release();
	}
};
