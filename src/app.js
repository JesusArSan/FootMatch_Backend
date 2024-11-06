// Express configuration
import express from "express";
import cors from "cors";
import morgan from "morgan";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { options } from "./swaggerOptions.js";
const specs = swaggerJSDoc(options); // Swagger options

import usersRoutes from "./routes/users.js";
import centersRoutes from "./routes/centers.js";
import matchesRoutes from "./routes/matches.js";
import teamsRoutes from "./routes/teams.js";
import competitionsRoutes from "./routes/competitions.js";

const app = express();

app.use(cors()); // Allow the app to connect to the server
app.use(morgan("dev")); // Show the requests in the console
app.use(express.json()); // Allow the app to understand JSON

// UserRoutes from the file routes/users.js. The app can visit the routes defined in the file users.js ONLY
app.use(usersRoutes);
// CentersRoutes from the file routes/centers.js
app.use(centersRoutes);
// MatchesRoutes from the file routes/matches.js
app.use(matchesRoutes);
// TeamsRoutes from the file routes/teams.js
app.use(teamsRoutes);
// CompetitionsRoutes from the file routes/competitions.js
app.use(competitionsRoutes);

// Swagger. Documents the routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

export default app;
