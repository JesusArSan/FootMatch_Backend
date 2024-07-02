import mysql from "mysql2/promise";
import { config } from "./config"; // Import the config object

export const connect = async () => {
  return await mysql.createConnection(config);
};
