import { Router } from "express";
import createUserHandler from "./create";
import validate from "../../../middleware/validate";
import {
  userSchema,
  verifyEmailSchema,
} from "../../../validationSchema.ts/user";
import tokenHandler from "./verifyEmail";

const userRoutes = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - userName
 *         - password
 *         - email
 *       properties:
 *         userName:
 *           type: string
 *           description: "The username of the user (required)."
 *           example: "john_doe"
 *         password:
 *           type: string
 *           description: "The password of the user (required)."
 *           example: "P@ssw0rd123"
 *         email:
 *           type: string
 *           format: email
 *           description: "The email address of the user (required)."
 *           example: "john@example.com"
 * paths:
 *   /api/v1/users/create:
 *     post:
 *       summary: "Create a new user"
 *       description: "Creates a new user in the system. Requires userName, password, and email."
 *       tags:
 *         - User
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       responses:
 *         "201":
 *           description: "User created successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User created successfully."
 *                   data:
 *                     $ref: "#/components/schemas/User"
 *         "400":
 *           description: "Bad Request – Validation error or missing required fields."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Invalid input data: Username is required."
 *   /api/v1/users/verify-account/{userId}/{token}:
 *     patch:
 *       summary: "Verify user account"
 *       description: "Verifies a user's account using the provided user ID and token."
 *       tags:
 *         - User
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: "The ID of the user to verify."
 *           schema:
 *             type: string
 *         - in: path
 *           name: token
 *           required: true
 *           description: "The verification token."
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: "Account verified successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Account verified successfully."
 *         "400":
 *           description: "Bad Request – Invalid token or missing parameters."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Invalid token or missing parameters."
 */



userRoutes.post("/create", validate(userSchema), createUserHandler);
userRoutes.patch(
  "/verify-account/:userId/:token",
  validate(verifyEmailSchema),
  tokenHandler
);

export default userRoutes;
