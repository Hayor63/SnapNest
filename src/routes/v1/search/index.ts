import { Router } from "express";
import searchDbHandler from "./searchDb";
import authenticateUser from "../../../middleware/authenticateUser";
import getTagsHandler from "./getTags";
import deleteTagHandler from "./deleteATag";

const searchRoutes = Router();
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * paths:
 *   /search:
 *     get:
 *       summary: Search the database
 *       description: Retrieves search results from the database.
 *       tags:
 *         - Search
 *       responses:
 *         "200":
 *           description: Search results retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         "500":
 *           description: Internal server error
 *
 *   /search/tags:
 *     get:
 *       summary: Get tags
 *       description: Retrieves all available tags.
 *       tags:
 *         - Search
 *       responses:
 *         "200":
 *           description: Tags retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: string
 *         "500":
 *           description: Internal server error
 *
 *   /search/{id}/tags/{index}:
 *     delete:
 *       summary: Delete a tag
 *       description: Deletes a specific tag by index for a given ID. Requires authentication.
 *       tags:
 *         - Search
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the entity associated with the tag
 *         - in: path
 *           name: index
 *           required: true
 *           schema:
 *             type: integer
 *           description: The index of the tag to delete
 *       responses:
 *         "200":
 *           description: Tag deleted successfully
 *         "401":
 *           description: Unauthorized - Authentication required
 *         "404":
 *           description: Tag not found
 *         "500":
 *           description: Internal server error
 */

//Search Db
searchRoutes.get(
    "/",
    searchDbHandler
  );

  //get Tags
searchRoutes.get(
    "/tags",
    getTagsHandler
  );


  //delete a tag
searchRoutes.delete(
    "/:id/tags/:index",
    authenticateUser,
    deleteTagHandler
  );



export default searchRoutes