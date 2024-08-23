// Urls that the app can visit
import { Router } from "express";
import {
	getCenters,
	getFavCenters,
	getPitchOccupancy,
	setFavCenter,
	deleteFavCenter,
} from "../controllers/centers";

const router = Router();

// Swagger
/**
 * @swagger
 * tags:
 *  name: Centers
 *  description: Centers endpoints
 */

/**
 * @swagger
 * /Centers:
 *  get:
 *    summary: Get all Centers
 *    tags: [Centers]
 */
router.get("/centers", getCenters); // Obtain all centers

/**
 * @swagger
 * /Centers:
 *  get:
 *    summary: Get all fav Centers from user
 *    tags: [Centers]
 */
router.get("/centers/:user_id", getFavCenters); // Obtain all fav centers

/**
 * @swagger
 * /Centers:
 *  get:
 *    summary: Get occupancy of a pitch
 *    tags: [Centers]
 */
router.get("/centers/pitch/:pitch_id", getPitchOccupancy); // Obtain all fav centers

/**
 * @swagger
 * /Centers:
 *  post:
 *    summary: Add a pitch on favorite user list
 *    tags: [Centers]
 */
router.post("/centers/add_fav_center", setFavCenter); // Put a pitch on favorite user list

/**
 * @swagger
 * /Centers:
 *  delete:
 *    summary: Delete a pitch from favorite user list
 *    tags: [Centers]
 */
router.delete("/centers/del_fav_center", deleteFavCenter); // Delete a pitch from favorite user list

export default router;
