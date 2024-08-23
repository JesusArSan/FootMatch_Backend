import { getConnection } from "../database";

///////////////////////////////////////////////////////////////////
// CENTERS FUNCTIONS
///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
// Function to get all centers
//
export const getCenters = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to get centers, images, and pitches
		const [rows] = await connection.query(
			`SELECT c.*, 
			        ci.id AS image_id, 
			        ci.uri AS image_uri, 
			        p.id AS pitch_id, 
			        p.type AS pitch_type, 
			        p.surface, 
			        p.status 
			FROM centers c
			LEFT JOIN center_images ci ON c.id = ci.center_id
			LEFT JOIN pitches p ON c.id = p.center_id
			ORDER BY c.id, ci.id ASC`
		);

		// Structure the data to group images and pitches under each center
		const centers = rows.reduce((acc, row) => {
			let center = acc.find((c) => c.id === row.id);

			if (!center) {
				// If the center doesn't exist, add it with initial images and pitches arrays
				center = {
					...row,
					images: row.image_id
						? [{ id: row.image_id, uri: row.image_uri }]
						: [],
					pitches: row.pitch_id
						? [
								{
									id: row.pitch_id,
									type: row.pitch_type,
									surface: row.surface,
									status: row.status,
								},
						  ]
						: [],
				};
				acc.push(center);
			} else {
				// If the center already exists, update images and pitches arrays without duplicates
				if (
					row.image_id &&
					!center.images.find((img) => img.id === row.image_id)
				) {
					center.images.push({ id: row.image_id, uri: row.image_uri });
				}
				if (
					row.pitch_id &&
					!center.pitches.find((p) => p.id === row.pitch_id)
				) {
					center.pitches.push({
						id: row.pitch_id,
						type: row.pitch_type,
						surface: row.surface,
						status: row.status,
					});
				}
			}

			return acc;
		}, []);

		// Send the structured response
		res.json(centers);
	} catch (error) {
		console.error("Error getting centers:", error);
		res.status(500).json({ message: "Error getting centers." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get the info of favourite centers
//
export const getFavCenters = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to get centers, images, and pitches for favourite centers
		const [rows] = await connection.query(
			`SELECT c.*, 
			        ci.id AS image_id, 
			        ci.uri AS image_uri, 
			        p.id AS pitch_id, 
			        p.type AS pitch_type, 
			        p.surface, 
			        p.status 
			FROM centers c
			INNER JOIN favourite_centers fv ON c.id = fv.center_id
			LEFT JOIN center_images ci ON c.id = ci.center_id
			LEFT JOIN pitches p ON c.id = p.center_id
			WHERE fv.user_id = ?
			ORDER BY c.id, ci.id ASC`,
			[req.params.user_id]
		);

		// Structure the data to group images and pitches under each center
		const favCenters = rows.reduce((acc, row) => {
			let center = acc.find((c) => c.id === row.id);

			if (!center) {
				// If the center doesn't exist, add it with initial images and pitches arrays
				center = {
					...row,
					images: row.image_id
						? [{ id: row.image_id, uri: row.image_uri }]
						: [],
					pitches: row.pitch_id
						? [
								{
									id: row.pitch_id,
									type: row.pitch_type,
									surface: row.surface,
									status: row.status,
								},
						  ]
						: [],
				};
				acc.push(center);
			} else {
				// If the center already exists, update images and pitches arrays without duplicates
				if (
					row.image_id &&
					!center.images.find((img) => img.id === row.image_id)
				) {
					center.images.push({ id: row.image_id, uri: row.image_uri });
				}
				if (
					row.pitch_id &&
					!center.pitches.find((p) => p.id === row.pitch_id)
				) {
					center.pitches.push({
						id: row.pitch_id,
						type: row.pitch_type,
						surface: row.surface,
						status: row.status,
					});
				}
			}

			return acc;
		}, []);

		// Send the structured response
		res.json(favCenters);
	} catch (error) {
		console.error("Error getting fav centers:", error);
		res.status(500).json({ message: "Error getting fav centers." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get the occupancy of a pitch
//
export const getPitchOccupancy = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to get the occupancy of a pitch
		const [rows] = await connection.query(
			`SELECT * FROM center_occupancies WHERE pitch_id = ?`,
			[req.params.pitch_id]
		);

		// Send the structured response
		res.json(rows);
	} catch (error) {
		console.error("Error getting pitch occupancy:", error);
		res.status(500).json({ message: "Error getting pitch occupancy." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
}

///////////////////////////////////////////////////////////////////
// Function to set a center as favourite
//
export const setFavCenter = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to set a center as favourite
		await connection.query(
			`INSERT INTO favourite_centers (user_id, center_id) VALUES (?, ?)`,
			[req.body.user_id, req.body.center_id]
		);

		// Send the structured response
		res.json({ message: "Center set as favourite." });
	} catch (error) {
		console.error("Error setting fav center:", error);
		res.status(500).json({ message: "Error setting fav center." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
}

///////////////////////////////////////////////////////////////////
// Function to delete a center from favourites
//
export const deleteFavCenter = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to delete a center from favourites
		await connection.query(
			`DELETE FROM favourite_centers WHERE user_id = ? AND center_id = ?`,
			[req.body.user_id, req.body.center_id]
		);

		// Send the structured response
		res.json({ message: "Center deleted from favourites." });
	} catch (error) {
		console.error("Error deleting fav center:", error);
		res.status(500).json({ message: "Error deleting fav center." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
}