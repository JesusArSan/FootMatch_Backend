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
			`SELECT u.id, u.username, u.name, u.email, u.photo
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
			`SELECT fr.id, fr.sender_id, u.username, u.photo AS sender_photo, fr.status, fr.created_at 
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
