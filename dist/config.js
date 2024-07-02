// Import dotenv. If you don't want to show ur config values to connect to the database, you can use dotenv to hide them.
// You use the file .env to define private values
import { config as dotenv } from "dotenv";
dotenv();

// Use the process.env object to get the values from the .env file and connect to the database
export const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "test"
};