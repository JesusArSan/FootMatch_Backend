import { getConnection } from "../database.js";
import jwt from "jsonwebtoken";

// Global variable
const SECRET_KEY = process.env.SECRET_KEY;

///////////////////////////////////////////////////////////////////
// USERS FUNCTIONS
///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
// Function to get all the users
//
export const getUsers = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to the database
		const [users] = await connection.query("SELECT * FROM users");

		// Send the response
		res.json(users);
	} catch (error) {
		console.error("Error getting users:", error);
		res.status(500).json({ message: "Error getting users." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get one user by id
//
export const getUser = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to the database
		const [user] = await connection.query(
			"SELECT * FROM users WHERE id = ?",
			[req.params.id]
		);

		// Check if the user exists
		if (user.length === 0) {
			return res.status(404).json({ message: "User not found" });
		} else {
			// Send the response
			res.json(user[0]);
		}
	} catch (error) {
		console.error("Error getting user:", error);
		res.status(500).json({ message: "Error getting user." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get one user by username
//
export const getUserByUsername = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to the database
		const [user] = await connection.query(
			"SELECT * FROM users WHERE username = ?",
			[req.params.username]
		);

		// Check if the user exists
		if (user.length === 0) {
			return res.status(404).json({ message: "User not found" });
		} else {
			// Send the response
			res.json(user[0]);
		}
	} catch (error) {
		console.error("Error getting user by username:", error);
		res.status(500).json({ message: "Error getting user by username." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get one user by email
//
export const getUserByEmail = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to the database
		const [user] = await connection.query(
			"SELECT * FROM users WHERE email= ?",
			[req.params.email]
		);

		// Check if the user exists
		if (user.length === 0) {
			return res.status(404).json({ message: "User not found" });
		} else {
			// Send the response
			res.json(user[0]);
		}
	} catch (error) {
		console.error("Error getting user by email:", error);
		res.status(500).json({ message: "Error getting user by email." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get the number of users
//
export const getUsersCount = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to the database
		const [numUsers] = await connection.query("SELECT count(*) FROM users");

		// Send the response
		res.json(numUsers[0]["count(*)"]);
	} catch (error) {
		console.error("Error getting users count:", error);
		res.status(500).json({ message: "Error getting users count." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to create a user
//
export const createUser = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Check for existing user by username
		const [usersByUsername] = await connection.query(
			"SELECT * FROM users WHERE username = ?",
			[req.body.username]
		);
		if (usersByUsername.length > 0) {
			return res.status(409).json({ message: "Username already in use." });
		}

		// Check for existing user by email
		const [usersByEmail] = await connection.query(
			"SELECT * FROM users WHERE email = ?",
			[req.body.email]
		);
		if (usersByEmail.length > 0) {
			return res.status(409).json({ message: "Email already in use." });
		}

		// Insert new user if no conflicts found
		const [results] = await connection.query(
			"INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)",
			[req.body.name, req.body.email, req.body.username, req.body.password]
		);

		// Generate a token
		const newToken = jwt.sign({ id: results.insertId }, SECRET_KEY, {
			expiresIn: 86400,
		}); // 24 hours

		// Successful response
		res.json({
			id: results.insertId,
			name: req.body.name,
			email: req.body.email,
			username: req.body.username,
			token: newToken,
		});
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ message: "Error creating user." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to delete a user
//
export const deleteUser = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to the database
		await connection.query("DELETE FROM users WHERE id = ?", [req.params.id]);

		// Send status
		res.sendStatus(204);
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ message: "Error deleting user." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to update a user
//
export const updateUser = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to the database
		const result = await connection.query("UPDATE users SET ? WHERE id = ?", [
			req.body,
			req.params.id,
		]);

		// Send the info of the new user
		res.json({ ...req.body, id: req.params.id });
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({ message: "Error updating user." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to login a user
//
export const loginUser = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to the database
		const [rows] = await connection.query(
			"SELECT * FROM users WHERE username = ? AND password = ?",
			[req.body.username, req.body.password]
		);

		const user = rows[0];

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		} else {
			// Generate a token
			const token = jwt.sign({ id: user.id }, SECRET_KEY, {
				expiresIn: 86400,
			}); // 24 hours

			// Remove the password from the user object before sending the response
			delete user.password;

			// Send the response
			res.json({
				...user,
				token: token,
			});
		}
	} catch (error) {
		console.error("Login error: ", error);
		res.status(500).json({ message: "Internal server error" });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get friends of a user
//
export const getFriends = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Get the user id from the request parameters
		const userId = req.params.id;

		// Query to the database to get friends details
		const [friends] = await connection.query(
			`SELECT u.id, u.username, u.name, u.email, u.role_id, u.photo
       FROM friends f
       JOIN users u ON f.friend_id = u.id
       WHERE f.user_id = ?`,
			[userId]
		);

		// Send the response
		res.json(friends);
	} catch (error) {
		console.error("Error getting friends:", error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to verify if a user is friend of other
//
export const isFriend = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Get the user id from the request parameters
		const userId = req.body.userId;
		const friendId = req.body.friendId;

		console.log("userId: ", userId);
		console.log("friendId: ", friendId);

		// Query to the database to get friends details
		const [friends] = await connection.query(
			`SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
			[userId, friendId, friendId, userId]
		);

		// Send the response
		res.json({ isFriend: friends.length > 0 });
	} catch (error) {
		console.error("Error getting friends:", error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get friend requests of a user
//
export const getFriendRequests = async (req, res) => {
	// Get the user id from the request
	const userId = req.params.id;
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Query to the database to get friend requests
		const [friendRequests] = await connection.query(
			`SELECT fr.id, fr.sender_id, u.username, u.role_id, u.photo AS sender_photo, fr.status, fr.created_at 
							FROM friend_requests fr 
							JOIN users u 
							ON fr.sender_id = u.id 
							WHERE fr.receiver_id = ? 
							AND fr.status = 'pending'`,
			[userId]
		);

		res.status(200).json(friendRequests);
	} catch (error) {
		console.error("Error getting friend requests:", error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

/////////////////////////////////////////////////////////////////////
// Function to send a friend request
//
export const sendFriendRequest = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		const { sender_id, receiver_id } = req.body;

		// Validate input data to avoid same  user as sender and receiver
		if (sender_id == receiver_id) {
			return res
				.status(400)
				.json({ error: "Sender and receiver IDs cannot be the same." });
		}

		// Validate input data
		if (!sender_id || !receiver_id) {
			return res
				.status(400)
				.json({ error: "Sender and receiver IDs are required." });
		}

		// Verify if the friend request already exists
		const [existingRequest] = await connection.query(
			`SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ? 
       AND status = 'pending'`,
			[sender_id, receiver_id]
		);
		if (existingRequest.length > 0) {
			return res.status(400).json({ error: "Friend request already sent." });
		}

		// Verify if the other user has already sent a friend request, if so, accept it
		const [existingRequest2] = await connection.query(
			`SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ? 
		 AND status = 'pending'`,
			[receiver_id, sender_id]
		);
		if (existingRequest2.length > 0) {
			// Accept the friend request
			await acceptFriendRequest(
				{ body: { requestId: existingRequest2[0].id } },
				res
			);
			// Create an insert in friend requests accepted
			await connection.query(
				`INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES (?, ?, 'accepted')`,
				[sender_id, receiver_id]
			);
			return;
		}

		// Verify if the users are already friends
		const [existingFriend] = await connection.query(
			`SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
			[sender_id, receiver_id, receiver_id, sender_id]
		);

		if (existingFriend.length > 0) {
			return res.status(400).json({ error: "Users are already friends." });
		}

		// Insert the friend request
		await connection.query(
			`INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES (?, ?, 'pending')`,
			[sender_id, receiver_id]
		);

		// Send the response
		res.status(200).json({ message: "Friend request sent successfully." });
	} catch (error) {
		console.error("Error sending friend request:", error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to accept a friend request
//
export const acceptFriendRequest = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Get the request id from the request body
		const requestId = req.body.requestId;

		// Verify if the friend request exists and is pending
		const [friendRequest] = await connection.query(
			`SELECT * FROM friend_requests WHERE id = ? AND status = 'pending'`,
			[requestId]
		);

		if (friendRequest.length === 0) {
			return res.status(400).json({
				error: "Friend request does not exist or is not pending.",
			});
		}

		const { sender_id, receiver_id } = friendRequest[0];

		// Update the status of the friend request to accepted
		await connection.query(
			`UPDATE friend_requests SET status = 'accepted' WHERE id = ?`,
			[requestId]
		);

		// Insert the friendship relation
		await connection.query(
			`INSERT INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)`,
			[sender_id, receiver_id, receiver_id, sender_id]
		);

		// Update other friend request status to accepted
		await connection.query(
			`UPDATE friend_requests SET status = 'accepted' WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`,
			[sender_id, receiver_id, receiver_id, sender_id]
		);

		// Send the response
		res.status(200).json({
			message: "Friend request accepted successfully.",
		});
	} catch (error) {
		console.error("Error accepting friend request:", error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to get friend request status
//
export const getFriendRequestStatus = async (req, res) => {
	const { sender_id, receiver_id } = req.body;
	let connection;
	try {
		connection = await getConnection();

		console.log("userId: ", sender_id);
		console.log("targetUserId: ", receiver_id);

		const [requestStatus] = await connection.query(
			`SELECT status FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?)`,
			[sender_id, receiver_id, receiver_id, sender_id]
		);

		if (requestStatus.length > 0) {
			res.status(200).json(requestStatus[0]);
		} else {
			res.status(200).json({ status: "none" });
		}
	} catch (error) {
		console.error("Error fetching friend request status:", error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (connection) connection.release();
	}
};

///////////////////////////////////////////////////////////////////
// Function to remove a friend request
//
export const removeFriendRequest = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();
		const { userId, friendId } = req.params;

		// Verify if the friend request exists
		const [existingRequest] = await connection.query(
			`SELECT * FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`,
			[userId, friendId, friendId, userId]
		);

		if (existingRequest.length === 0) {
			return res
				.status(400)
				.json({ error: "Friend request does not exist." });
		}

		// Delete the friend request
		const [deleteRequestResult] = await connection.query(
			`DELETE FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`,
			[userId, friendId, friendId, userId]
		);

		if (deleteRequestResult.affectedRows === 0) {
			return res
				.status(400)
				.json({ error: "Failed to remove friend request." });
		}

		res.status(200).json({
			message: "Friend request removed successfully.",
		});
	} catch (error) {
		console.error("Error removing friend request:", error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to remove a friend
//
export const removeFriend = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();
		const { userId, friendId } = req.params;

		// Verify if the users are friends
		const [existingFriend] = await connection.query(
			`SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
			[userId, friendId, friendId, userId]
		);

		if (existingFriend.length === 0) {
			return res.status(400).json({ error: "Friendship does not exist." });
		}

		// Delete the friendship relation
		const [deleteFriendResult] = await connection.query(
			`DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
			[userId, friendId, friendId, userId]
		);

		if (deleteFriendResult.affectedRows === 0) {
			return res.status(400).json({ error: "Failed to remove friendship." });
		}

		// Delete related friend requests
		await connection.query(
			`DELETE FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`,
			[userId, friendId, friendId, userId]
		);

		res.status(200).json({
			message: "Friend removed successfully.",
		});
	} catch (error) {
		console.error("Error removing friend:", error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Function to validate token
//
export const validateToken = (req, res) => {
	const token = req.body.token;
	if (!token) {
		return res.status(403).json({ message: "No token provided" });
	}

	jwt.verify(token, SECRET_KEY, (err, decoded) => {
		if (err) {
			return res
				.status(500)
				.json({ message: "Failed to authenticate token" });
		}
		// If everything is good, response with the user id
		res.status(200).json({ message: "Token is valid", userId: decoded.id });
	});
};

// Function to update the user's profile photo URL
export const updateProfilePhoto = async (req, res) => {
	const { userId } = req.params;
	const { photoUrl } = req.body;

	if (!photoUrl) {
		return res.status(400).json({ message: "Photo URL is required." });
	}

	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Update the user's profile photo URL in the database
		const [result] = await connection.query(
			"UPDATE users SET photo = ? WHERE id = ?",
			[photoUrl, userId]
		);

		// Check if the user was updated
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "User not found." });
		}

		// Send a success response
		res.status(200).json({ message: "Profile photo updated successfully." });
	} catch (error) {
		console.error("Error updating profile photo:", error);
		res.status(500).json({ message: "Error updating profile photo." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

// Function to update a user's role
export const updateUserRole = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		const { user_id } = req.params; // Get user_id from URL parameters
		const { role_id } = req.body; // Get role_id from request body

		// Check if user exists
		const [existingUser] = await connection.query(
			"SELECT * FROM users WHERE id = ?",
			[user_id]
		);
		if (existingUser.length === 0) {
			return res.status(404).json({ message: "User not found." });
		}

		// Update the user's role
		await connection.query("UPDATE users SET role_id = ? WHERE id = ?", [
			role_id,
			user_id,
		]);

		// Successful response
		res.json({ message: "User role updated successfully." });
	} catch (error) {
		console.error("Error updating user role:", error);
		res.status(500).json({ message: "Error updating user role." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Get the latest completed match for a user
//
export const getLatestCompletedMatchForUser = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		const { userId } = req.params; // Get userId from URL parameters

		// Fetch completed matches for the user, including date, pitch_id, and creator details
		const [completedMatches] = await connection.query(
			`
			SELECT m.id AS matchId, h.date_time AS date, m.status,
				m.created_by_user_id AS createdByUserId, m.match_done, h.pitch_id AS pitchId,
				teamA.name AS teamAName, teamA.logo_url AS teamALogo, m.team_a_score AS teamAScore,
				teamB.name AS teamBName, teamB.logo_url AS teamBLogo, m.team_b_score AS teamBScore
			FROM matches m
			JOIN teams teamA ON m.team_a_id = teamA.id
			JOIN teams teamB ON m.team_b_id = teamB.id
			JOIN match_participants mp ON mp.match_id = m.id
			JOIN host h ON h.match_id = m.id
			WHERE mp.user_id = ? AND m.status = 'completed'
			ORDER BY h.date_time DESC
			LIMIT 1;
			`,
			[userId]
		);

		// Check if a completed match was found
		if (completedMatches.length === 0) {
			return res
				.status(404)
				.json({ message: "No completed matches found for this user." });
		}

		// Get the latest completed match
		const match = completedMatches[0];

		// Successful response
		res.json({
			matchId: match.matchId,
			date: match.date,
			status: match.status,
			pitchId: match.pitchId,
			createdByUserId: match.createdByUserId,
			teamA: {
				name: match.teamAName,
				logo: match.teamALogo,
				score: match.teamAScore,
			},
			teamB: {
				name: match.teamBName,
				logo: match.teamBLogo,
				score: match.teamBScore,
			},
		});
	} catch (error) {
		console.error("Error fetching latest completed match for user:", error);
		res.status(500).json({
			message: "Error fetching latest completed match for user.",
		});
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Create Publication
//
export const createPublication = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Data from request body
		const { text, likes = 0, user_id } = req.body;

		// Query to insert new publication (post_on will default to current timestamp)
		const [result] = await connection.query(
			`INSERT INTO publications (text, likes, user_id) VALUES (?, ?, ?)`,
			[text, likes, user_id]
		);

		// Send success response with new publication ID
		res.json({
			message: "Publication created successfully",
			publicationId: result.insertId,
		});
	} catch (error) {
		console.error("Error creating publication:", error);
		res.status(500).json({ message: "Error creating publication." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Delete Publication
//
export const deletePublication = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Publication ID from request parameters
		const publicationId = req.params.id;

		// Query to delete publication
		const [result] = await connection.query(
			`DELETE FROM publications WHERE id = ?`,
			[publicationId]
		);

		// Check if the delete was successful
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Publication not found." });
		}

		// Send success response
		res.json({ message: "Publication deleted successfully." });
	} catch (error) {
		console.error("Error deleting publication:", error);
		res.status(500).json({ message: "Error deleting publication." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Get Friends' Publications
//
export const getFriendsPublications = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// User ID from request parameters
		const userId = req.params.id;

		// Get friends of the user
		const [friends] = await connection.query(
			`SELECT u.id
				FROM friends f
				JOIN users u ON f.friend_id = u.id
				WHERE f.user_id = ?`,
			[userId]
		);

		// Extract friend IDs
		const friendIds = friends.map((friend) => friend.id);
		if (friendIds.length === 0) {
			return res.json([]);
		}

		// Query to get publications of friends
		const [publications] = await connection.query(
			`SELECT p.*
				FROM publications p
				WHERE p.user_id IN (?)`,
			[friendIds]
		);

		// Send the publications response
		res.json(publications);
	} catch (error) {
		console.error("Error getting friends' publications:", error);
		res.status(500).json({ message: "Error getting friends' publications." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Add Like to Publication
//
export const addLike = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Publication ID from request parameters
		const publicationId = req.params.id;

		// Query to increment the like count
		const [result] = await connection.query(
			`UPDATE publications SET likes = likes + 1 WHERE id = ?`,
			[publicationId]
		);

		// Check if the update was successful
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Publication not found." });
		}

		// Send success response
		res.json({ message: "Like added successfully." });
	} catch (error) {
		console.error("Error adding like to publication:", error);
		res.status(500).json({ message: "Error adding like to publication." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Remove Like from Publication
//
export const removeLike = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Publication ID from request parameters
		const publicationId = req.params.id;

		// Query to decrement the like count, ensuring it does not go below zero
		const [result] = await connection.query(
			`UPDATE publications SET likes = GREATEST(likes - 1, 0) WHERE id = ?`,
			[publicationId]
		);

		// Check if the update was successful
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Publication not found." });
		}

		// Send success response
		res.json({ message: "Like removed successfully." });
	} catch (error) {
		console.error("Error removing like from publication:", error);
		res.status(500).json({
			message: "Error removing like from publication.",
		});
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Get Likes of Publication
//
export const getLikes = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// Publication ID from request parameters
		const publicationId = req.params.id;

		// Query to get the like count
		const [result] = await connection.query(
			`SELECT likes FROM publications WHERE id = ?`,
			[publicationId]
		);

		// Check if the publication was found
		if (!result.length) {
			return res.status(404).json({ message: "Publication not found." });
		}

		// Send the like count
		res.json({ likes: result[0].likes });
	} catch (error) {
		console.error("Error getting likes of publication:", error);
		res.status(500).json({ message: "Error getting likes of publication." });
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Update User Experience Points
//
export const updateUserExp = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// User ID from request parameters
		const userId = req.params.id;

		// Query to calculate statistics for the user
		const [stats] = await connection.query(
			`SELECT 
					SUM(mp.goals) AS total_goals,
					SUM(mp.assists) AS total_assists,
					COUNT(mp.match_id) AS matches_played,
					SUM(CASE WHEN m.status = 'completed' AND m.team_a_id = mp.team_id AND m.team_a_score > m.team_b_score THEN 1
								WHEN m.status = 'completed' AND m.team_b_id = mp.team_id AND m.team_b_score > m.team_a_score THEN 1
								ELSE 0 END) AS matches_won,
					SUM(CASE WHEN m.status = 'completed' AND m.team_a_id = mp.team_id AND m.team_a_score < m.team_b_score THEN 1
								WHEN m.status = 'completed' AND m.team_b_id = mp.team_id AND m.team_b_score < m.team_a_score THEN 1
								ELSE 0 END) AS matches_lost
			  FROM match_participants mp
			  JOIN matches m ON mp.match_id = m.id
			  WHERE mp.user_id = ?`,
			[userId]
		);

		// Check if user has any match records
		if (!stats.length || stats[0].matches_played === 0) {
			return res
				.status(404)
				.json({ message: "No match records found for the user." });
		}

		// Extract stats
		const {
			total_goals,
			total_assists,
			matches_played,
			matches_won,
			matches_lost,
		} = stats[0];

		// Calculate experience bonus based on matches played
		const experience_bonus = matches_played > 15 ? 1.2 : 1.0;

		// Calculate total experience points
		const user_exp =
			(total_goals * 2 +
				total_assists * 1.5 +
				matches_won * 3 -
				matches_lost * 1.5 +
				matches_played * 0.5) *
			experience_bonus;

		// Update user_exp in users table
		await connection.query(`UPDATE users SET user_exp = ? WHERE id = ?`, [
			user_exp,
			userId,
		]);

		// Send success response with updated experience points
		res.json({
			message: "User experience points updated successfully.",
			user_exp,
		});
	} catch (error) {
		console.error("Error updating user experience points:", error);
		res.status(500).json({
			message: "Error updating user experience points.",
		});
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};

///////////////////////////////////////////////////////////////////
// Get User Experience Points
//
export const getUserExp = async (req, res) => {
	let connection;
	try {
		// Get a connection from the pool
		connection = await getConnection();

		// User ID from request parameters
		const userId = req.params.id;

		// Query to get user experience points
		const [user] = await connection.query(
			`SELECT user_exp FROM users WHERE id = ?`,
			[userId]
		);

		// Check if the user was found
		if (!user.length) {
			return res.status(404).json({ message: "User not found." });
		}

		// Send the user experience points
		res.json({ user_exp: user[0].user_exp });
	} catch (error) {
		console.error("Error getting user experience points:", error);
		res.status(500).json({
			message: "Error getting user experience points.",
		});
	} finally {
		if (connection) connection.release(); // Release the connection
	}
};
