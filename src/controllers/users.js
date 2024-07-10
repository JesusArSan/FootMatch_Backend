// Answer to a url from app
import { connect } from "../database";
const jwt = require("jsonwebtoken");

// Global variable
const SECRET_KEY = process.env.SECRET_KEY;

///////////////////////////////////////////////////////////////////
// USERS FUNCTIONS
///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
// Function to get all the users
//
export const getUsers = async (req, res) => {
	// Connection to the database
	const connection = await connect();

	// Query to the database
	const [users] = await connection.query("SELECT * FROM users");

	// Send the response
	res.json(users);
};

///////////////////////////////////////////////////////////////////
// Function to get one user by id
//
export const getUser = async (req, res) => {
	// Connection to the database
	const connection = await connect();

	// Query to the database
	const [user] = await connection.query("SELECT * FROM users WHERE id = ?", [
		req.params.id,
	]);

	// Check if the user exists
	if (user.length === 0) {
		return res.status(404).json({ message: "User not found" });
	} else {
		// Send the response
		res.json(user[0]);
	}
};

///////////////////////////////////////////////////////////////////
// Function to get one user by username
//
export const getUserByUsername = async (req, res) => {
	// Connection to the database
	const connection = await connect();

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
};

///////////////////////////////////////////////////////////////////
// Function to get one user by email
//
export const getUserByEmail = async (req, res) => {
	// Connection to the database
	const connection = await connect();

	// Query to the database
	const [user] = await connection.query("SELECT * FROM users WHERE email= ?", [
		req.params.email,
	]);

	// Check if the user exists
	if (user.length === 0) {
		return res.status(404).json({ message: "User not found" });
	} else {
		// Send the response
		res.json(user[0]);
	}
};

///////////////////////////////////////////////////////////////////
// Function to get the number of users
//
export const getUsersCount = async (req, res) => {
	// Connection to the database
	const connection = await connect();

	// Query to the database
	const [numUsers] = await connection.query("SELECT count(*) FROM users");

	// Send the response
	res.json(numUsers[0]["count(*)"]);
};

///////////////////////////////////////////////////////////////////
// FUNCIONES PARA CREATEUSER
/////////////////////////////
export const findUserByUsername = async (username, connection) => {
	const [users] = await connection.query(
		"SELECT * FROM users WHERE username = ?",
		[username]
	);
	return users;
};

export const findUserByEmail = async (email, connection) => {
	const [users] = await connection.query(
		"SELECT * FROM users WHERE email = ?",
		[email]
	);
	return users;
};

///////////////////////////////////////////////////////////////////
// Function to create a user
export const createUser = async (req, res) => {
	try {
		// Connection to the database
		const connection = await connect();

		// Check for existing user by username
		const usersByUsername = await findUserByUsername(
			req.body.username,
			connection
		);
		if (usersByUsername.length > 0) {
			return res.status(409).json({ message: "Username already in use." });
		}

		// Check for existing user by email
		const usersByEmail = await findUserByEmail(req.body.email, connection);
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
	}
};

///////////////////////////////////////////////////////////////////
// Function to delete a user
//
export const deleteUser = async (req, res) => {
	// Connection to the database
	const connection = await connect();

	// Query to the database
	await connection.query("DELETE FROM users WHERE id = ?", [req.params.id]);

	// Send status
	res.sendStatus(204);
};

///////////////////////////////////////////////////////////////////
// Function to update a user
//
export const updateUser = async (req, res) => {
	// Connection to the database
	const connection = await connect();

	// Query to the database
	const result = await connection.query("UPDATE users SET ? WHERE id = ?", [
		req.body,
		req.params.id,
	]);

	// Send the info of the new user
	res.json({ ...req.body, id: req.params.id });
};

///////////////////////////////////////////////////////////////////
// Function to login a user
//
export const loginUser = async (req, res) => {
	try {
		// Connection to the database
		const connection = await connect();

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
	}
};

// Validation token
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
