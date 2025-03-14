import { Router } from "express";
import authenticateUser from "../../../middleware/authenticateUser";
import {
  deleteSinglePinSchema,
  dislikePinSchema,
  getPinsLikedByUserSchema,
  getRelatedPinsSchema,
  getSinglePinSchema,
  likePinSchema,
  pinSchema,
  updatePinSchema,
} from "../../../validationSchema.ts/pin";
import createPinHandler from "./create";
import validate from "../../../middleware/validate";
import fetchPinsHandler from "./paginate";
import getFollowedPinsHandler from "./getFollowedPins";
import getRandomPinsHandler from "./getRandomPins";
import likeAPinHandler from "./likeAPins";
import disLikeAPinHandler from "./dislikeAPins";
import getPinsLikedByUserHandler from "./getPinsLikedByUser";
import updatePinHandler from "./update";
import deletePinHandler from "./delete";
import getRelatedPinHandler from "./getRelatedTags";
import getSinglePinHandler from "./getSinglePins";

const pinRoutes = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Pin:
 *       type: object
 *       required:
 *         - title
 *         - image
 *         - userId
 *       properties:
 *         title:
 *           type: string
 *           example: "Beautiful Sunset"
 *         image:
 *           type: string
 *           example: "http://example.com/image.jpg"
 *         description:
 *           type: string
 *           example: "A lovely view at sunset."
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     PinResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/Pin"
 *     PinArray:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Pin"
 *
 * paths:
 *   /api/v1/pins/create:
 *     post:
 *       summary: "Create a new pin"
 *       description: "Creates a new pin. Authentication required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Pin"
 *       responses:
 *         "201":
 *           description: "Pin created successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinResponse"
 *         "400":
 *           description: "Bad Request – Validation error or missing required fields."
 *
 *   /api/v1/pins/:
 *     get:
 *       summary: "Fetch pins"
 *       description: "Retrieves a paginated list of pins. Authentication required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         "200":
 *           description: "Pins retrieved successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinArray"
 *
 *   /api/v1/pins/followed:
 *     get:
 *       summary: "Get followed pins"
 *       description: "Retrieves pins from followed users. Authentication required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         "200":
 *           description: "Followed pins retrieved successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinArray"
 *
 *   /api/v1/pins/random-explore:
 *     get:
 *       summary: "Get random pins"
 *       description: "Retrieves a random set of pins for exploration."
 *       tags:
 *         - Pins
 *       responses:
 *         "200":
 *           description: "Random pins retrieved successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinArray"
 *
 *   /api/v1/pins/{id}/userpins:
 *     get:
 *       summary: "Get user pins"
 *       description: "Retrieves pins created by a specific user. Authentication required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the user whose pins to retrieve."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "User pins retrieved successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinArray"
 *
 *   /api/v1/pins/like/{id}:
 *     put:
 *       summary: "Like a pin"
 *       description: "Adds a like to a pin. Authentication required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the pin to like."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Pin liked successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinResponse"
 *         "400":
 *           description: "Bad Request – Pin not found or validation error."
 *
 *   /api/v1/pins/dislike/{id}:
 *     put:
 *       summary: "Dislike a pin"
 *       description: "Removes a like from a pin. Authentication required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the pin to dislike."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Pin disliked successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinResponse"
 *         "400":
 *           description: "Bad Request – Pin not found or validation error."
 *
 *   /api/v1/pins/{id}/likedpins:
 *     get:
 *       summary: "Get pins liked by user"
 *       description: "Retrieves pins liked by the user. Authentication required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the user whose liked pins to retrieve."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Liked pins retrieved successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinArray"
 *
 *   /api/v1/pins/{id}/update:
 *     patch:
 *       summary: "Update a pin"
 *       description: "Updates a pin. Authentication required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the pin to update."
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Pin"
 *       responses:
 *         "200":
 *           description: "Pin updated successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinResponse"
 *         "400":
 *           description: "Bad Request – Validation error or pin not found."
 *
 *   /api/v1/pins/{id}:
 *     delete:
 *       summary: "Delete a pin"
 *       description: "Deletes a pin. Authentication required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the pin to delete."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Pin deleted successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Pin deleted successfully."
 *         "404":
 *           description: "Pin not found."
 *
 *   /api/v1/pins/{id}/related:
 *     get:
 *       summary: "Get related pins"
 *       description: "Retrieves pins related to the specified pin based on shared tags. Authentication required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the pin for which to retrieve related pins."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Related pins retrieved successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinArray"
 *         "404":
 *           description: "Pin not found or no related pins found."
 *
 *   /api/v1/pins/singlepin/{id}:
 *     get:
 *       summary: "Get a single pin by ID"
 *       description: "Retrieves a single pin by its ID. Authentication and validation required."
 *       tags:
 *         - Pins
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the pin to retrieve."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Pin retrieved successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/PinResponse"
 *         "400":
 *           description: "Bad Request – Validation error or pin not found."
 *         "404":
 *           description: "Pin not found."
 */

pinRoutes.post(
  "/create",
  authenticateUser,
  validate(pinSchema),
  createPinHandler
);

pinRoutes.get("/", authenticateUser, fetchPinsHandler);

//get followed pins
pinRoutes.get("/followed", authenticateUser, getFollowedPinsHandler);

//get random pins
pinRoutes.get("/random-explore", getRandomPinsHandler);

//get user pins
pinRoutes.get("/:id/userpins", authenticateUser, getRandomPinsHandler);

// get single pins
pinRoutes.get(
  "/singlepin/:id",
  authenticateUser,
  validate(getSinglePinSchema),
  getSinglePinHandler
);

//like a pin
pinRoutes.put(
  "/like/:id",
  authenticateUser,
  validate(likePinSchema),
  likeAPinHandler
);
//dislike a pin
pinRoutes.put(
  "/dislike/:id",
  authenticateUser,
  validate(dislikePinSchema),
  disLikeAPinHandler
);

//get pins liked by user
pinRoutes.get(
  "/:id/likedpins",
  authenticateUser,
  validate(getPinsLikedByUserSchema),
  getPinsLikedByUserHandler
);

//update pin
pinRoutes.patch(
  "/:id/update",
  authenticateUser,
  validate(updatePinSchema),
  updatePinHandler
);

//delete pin
pinRoutes.delete(
  "/:id",
  authenticateUser,
  validate(deleteSinglePinSchema),
  deletePinHandler
);

//get related pin
pinRoutes.get(
  "/:id/related",
  authenticateUser,
  validate(getRelatedPinsSchema),
  getRelatedPinHandler
);
export default pinRoutes;
