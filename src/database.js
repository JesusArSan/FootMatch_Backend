import mysql from "mysql2/promise";
import { config } from "./config.js"; // Import the config object

// Create a pool of connections
export const pool = mysql.createPool(config);

// Get a connection from the pool
export const getConnection = async () => {
	return await pool.getConnection();
};
