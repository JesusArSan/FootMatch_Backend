import mysql from "mysql2/promise";
import { config } from "./config"; // Import the config object

// Crear un pool de conexiones
export const pool = mysql.createPool(config);

// Función para obtener una conexión del pool
export const getConnection = async () => {
	return await pool.getConnection();
};
