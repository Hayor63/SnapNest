import { Router } from "express";
import authenticateUser from "../../../middleware/authenticateUser";
import addACommentHandler from "./addAComment";
import {
  commentSchema,
  deleteSingleCommentSchema,
  dislikeCommentSchema,
  getCommentSchema,
  likeCommentSchema,
  updateCommentSchema,
} from "../../../validationSchema.ts/comment";
import validate from "../../../middleware/validate";
import getCommentHandler from "./getComment";
import likeACommentHandler from "./likeAComment";
import disLikeACommentHandler from "./dislikeAComment";
import deleteCommentHandler from "./delete";
import updateCommentHandler from "./updateComment";

const commentRoutes = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - comment
 *         - userId
 *         - pinId
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         userId:
 *           type: string
 *           example: "67b87b40008a576f9213121b"
 *         pinId:
 *           type: string
 *           example: "67bb2b74c0ec8440df4df8fe"
 *         comment:
 *           type: string
 *           example: "What a view!"
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         likeCount:
 *           type: number
 *           example: 0
 *     CommentResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/Comment"
 *
 * paths:
 *   /api/v1/comments/{id}/add:
 *     post:
 *       summary: "Add a Comment"
 *       description: "Creates a new comment on the pin identified by {id}. Authentication is required."
 *       tags:
 *         - Comments
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the pin to which the comment will be added."
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   type: string
 *                   example: "What a view!"
 *       responses:
 *         "201":
 *           description: "Comment created successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/CommentResponse"
 *         "400":
 *           description: "Bad Request – Validation error or missing required fields."
 *
 *   /api/v1/comments/comments/like/{id}:
 *     put:
 *       summary: "Like a Comment"
 *       description: "Adds a like to the comment identified by {id}. Authentication is required."
 *       tags:
 *         - Comments
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the comment to like."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Comment liked successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/CommentResponse"
 *         "400":
 *           description: "Bad Request – Comment not found or already liked."
 *
 *   /api/v1/comments/comments/dislike/{id}:
 *     put:
 *       summary: "Dislike a Comment"
 *       description: "Removes a like from the comment identified by {id}. Authentication is required."
 *       tags:
 *         - Comments
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the comment to dislike."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Comment disliked successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/CommentResponse"
 *         "400":
 *           description: "Bad Request – Comment not found or not liked."
 *
 *   /api/v1/comments/delete/{id}:
 *     delete:
 *       summary: "Delete a Comment"
 *       description: "Deletes the comment identified by {id}. Authentication is required."
 *       tags:
 *         - Comments
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the comment to delete."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Comment deleted successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Comment deleted successfully."
 *         "404":
 *           description: "Comment not found."
 *
 *   /api/v1/comments/{id}:
 *     get:
 *       summary: "Get a Comment"
 *       description: "Retrieves the comment identified by {id}. Authentication is required."
 *       tags:
 *         - Comments
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the comment to retrieve."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Comment retrieved successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/CommentResponse"
 *         "404":
 *           description: "Comment not found."
 *     patch:
 *       summary: "Update a Comment"
 *       description: "Updates the comment identified by {id}. Authentication is required."
 *       tags:
 *         - Comments
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: "The ID of the comment to update."
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   type: string
 *                   example: "Updated comment text."
 *       responses:
 *         "200":
 *           description: "Comment updated successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/CommentResponse"
 *         "400":
 *           description: "Bad Request – Validation error or comment not found."
 */



commentRoutes.post(
  "/:id/add",
  authenticateUser,
  validate(commentSchema),
  addACommentHandler
);

commentRoutes.get(
  "/:id",
  authenticateUser,
  validate(getCommentSchema),
  getCommentHandler
);

//like a comment
commentRoutes.put(
  "/comments/like/:id",
  authenticateUser,
  validate(likeCommentSchema),
  likeACommentHandler
);

//dislike a comment
commentRoutes.put(
  "/comments/dislike/:id",
  authenticateUser,
  validate(dislikeCommentSchema),
  disLikeACommentHandler
);

//delete comment
commentRoutes.delete(
  "/delete/:id",
  authenticateUser,
  validate(deleteSingleCommentSchema),
  deleteCommentHandler
);

//update comment
commentRoutes.patch(
  "/:id",
  authenticateUser,
  validate(updateCommentSchema),
  updateCommentHandler
);

export default commentRoutes;
