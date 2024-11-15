// Urls that the app can visit
import { Router } from "express";
import {
	getCenters,
	getCenterByPitch,
	getFavCenters,
	getPitchHost,
	setFavCenter,
	deleteFavCenter,
} from "../controllers/centers.js";

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
 * get:
 * summary: Get center info by number of pitch
 * tags: [Centers]
 */
router.get("/centers/pitch/:pitch_id", getCenterByPitch); // Obtain center by pitch

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
 * /pitches/{pitch_id}/host:
 *  get:
 *    summary: Get the host (occupancy) of a pitch
 *    tags: [Host]
 *    parameters:
 *      - in: path
 *        name: pitch_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the pitch
 *    responses:
 *      200:
 *        description: Host details of the pitch
 *      500:
 *        description: Server error
 */
router.get("/centers/pitches/:pitch_id/host", getPitchHost); // Obtain all fav centers

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
