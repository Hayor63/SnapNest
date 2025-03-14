import { getFollowedUsersSchema, getFollowersSchema, getFollowSchema, getUnFollowSchema, getUserProfileSchema, recoverPasswordSchema, resetPasswordSchema, updateUserProfileSchema } from "../../../validationSchema.ts/user";
import { Router } from "express";
import validate from "../../../middleware/validate";
import { userLoginSchema } from "../../../validationSchema.ts/user";
import loginHandler from "./login";
import authenticateUser from "../../../middleware/authenticateUser";
import authenticateUserHandler from "./authenticateUser";
import getUserProfileHandler from "./getUserProfile";
import updateUserProfileHandler from "./updateUser";
import recoverPasswordHandler from "./recoverPassword";
import followUserHandler from "./followAUser";
import unfollowUserHandler from "./unfollowAUser";
import getFollowedUserHandler from "./getFollowedUsers";
import getFollowersHandler from "./getFollowers";
import resetPasswordHandler from "./resetPassword";

const authRoutes = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UserLogin:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           format: email
 *           example: "john123"
 *         password:
 *           type: string
 *           example: "P@ssw0rd123"
 *       required:
 *         - userName
 *         - password
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         userName:
 *           type: string
 *           example: "john_doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *       required:
 *         - _id
 *         - userName
 *         - email
 *     UpdateUserProfile:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           example: "john_doe_updated"
 *         password:
 *           type: string
 *           example: "P@ssw0rd123"
 *         email:
 *           type: string
 *           format: email
 *           example: "john_updated@example.com"
 *         profilePicture:
 *           type: string
 *           example: "http://example.com/profile.jpg"
 *         bio:
 *           type: string
 *           example: "life is good"
 *     RecoverPassword:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *       required:
 *         - email
 *     ResetPassword:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *           example: "NewP@ssw0rd123"
 *       required:
 *         - password
 * paths:
 *   /api/v1/auth/login:
 *     post:
 *       summary: "User Login"
 *       description: "Logs in a user using userName and password."
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserLogin"
 *       responses:
 *         "200":
 *           description: "User logged in successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Login successful"
 *                   token:
 *                     type: string
 *                     example: "eyJhbGciOiJIUzI1NiIsInR..."
 *         "400":
 *           description: "Bad Request – Invalid credentials or input."
 *   /api/v1/auth/profile:
 *     get:
 *       summary: "Authenticate User"
 *       description: "Checks if the provided bearer token is valid and returns user details."
 *       tags:
 *         - Auth
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         "200":
 *           description: "User authenticated successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UserProfile"
 *         "401":
 *           description: "Unauthorized – Invalid token."
 *   /api/v1/auth/profile/{userName}:
 *     get:
 *       summary: "Get User Profile"
 *       description: "Retrieves the profile of a user by username."
 *       tags:
 *         - Auth
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: userName
 *           required: true
 *           schema:
 *             type: string
 *           description: "Username of the user whose profile to retrieve."
 *       responses:
 *         "200":
 *           description: "Profile retrieved successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UserProfile"
 *         "404":
 *           description: "User not found."
 *   /api/v1/auth/update-user/{id}:
 *     patch:
 *       summary: "Update User Profile"
 *       description: "Updates the profile of a user by their ID."
 *       tags:
 *         - Auth
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: "The ID of the user to update."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateUserProfile"
 *       responses:
 *         "200":
 *           description: "User profile updated successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UserProfile"
 *         "400":
 *           description: "Bad Request – Invalid input."
 *   /api/v1/auth/recover-password:
 *     post:
 *       summary: "Recover Password"
 *       description: "Initiates password recovery by sending a recovery link to the user's email."
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RecoverPassword"
 *       responses:
 *         "200":
 *           description: "Recovery email sent successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Recovery email sent."
 *         "400":
 *           description: "Bad Request – Invalid email or input."
 *   /api/v1/auth/reset-password/{id}/{token}:
 *     patch:
 *       summary: "Reset Password"
 *       description: "Resets the user's password using the provided ID and token."
 *       tags:
 *         - Auth
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: "The ID of the user."
 *         - in: path
 *           name: token
 *           required: true
 *           schema:
 *             type: string
 *           description: "Password reset token."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResetPassword"
 *       responses:
 *         "200":
 *           description: "Password reset successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Password reset successful."
 *         "400":
 *           description: "Bad Request – Invalid token or input."
 *   /api/v1/auth/follow/{userId}:
 *     put:
 *       summary: "Follow a User"
 *       description: "Follows a user specified by the userId."
 *       tags:
 *         - Auth
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: "The ID of the user to follow."
 *       responses:
 *         "200":
 *           description: "User followed successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User followed."
 *         "400":
 *           description: "Bad Request – Invalid userId."
 *   /api/v1/auth/unfollow/{userId}:
 *     put:
 *       summary: "Unfollow a User"
 *       description: "Unfollows a user specified by the userId."
 *       tags:
 *         - Auth
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: "The ID of the user to unfollow."
 *       responses:
 *         "200":
 *           description: "User unfollowed successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User unfollowed."
 *         "400":
 *           description: "Bad Request – Invalid userId."
 *   /api/v1/auth/following/{id}:
*     get:
 *       summary: "Get Following List"
 *       description: "Retrieves a list of users that the specified user is following."
 *       tags:
 *         - Auth
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: "The ID of the user whose following list is to be retrieved."
 *       responses:
 *         "200":
 *           description: "Following list retrieved successfully."
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/UserProfile"
 *         "400":
 *           description: "Bad Request – Invalid user ID."
 *   /api/v1/auth/followers/{id}:
 *     get:
 *       summary: "Get Followers"
 *       description: "Retrieves a list of users who follow the user with the specified ID."
 *       tags:
 *         - Auth
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: "The ID of the user whose followers are to be retrieved."
 *       responses:
*         "200":
*           description: "Successfully retrieved the list of users following the specified user."
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/UserProfile"
 *         "400":
 *           description: "Bad Request – Invalid user ID."

 */


authRoutes.post("/login", validate(userLoginSchema), loginHandler);
//get user profile
authRoutes.get(
  "/profile",
  authenticateUser,
  authenticateUserHandler
);

//get users Profile
authRoutes.get(
  "/profile/:userName",
  authenticateUser,
  validate(getUserProfileSchema),
  getUserProfileHandler
);

//update user profile
authRoutes.patch(
    "/update-user/:id",
    authenticateUser,
    validate(updateUserProfileSchema),
    updateUserProfileHandler
  );

  //Recover Password link
authRoutes.post(
  "/recover-password",
  validate(recoverPasswordSchema),
  recoverPasswordHandler
);

//reset password
authRoutes.patch(
  "/reset-password/:id/:token",
  validate(resetPasswordSchema),
  resetPasswordHandler
);
  

//follow User
authRoutes.put(
  "/follow/:userId",
  authenticateUser,
  validate(getFollowSchema),
  followUserHandler
);

//unfollow user
authRoutes.put(
  "/unfollow/:userId",
  authenticateUser,
  validate(getUnFollowSchema),
  unfollowUserHandler
);

//get followers
authRoutes.get(
  "/following/:id",
  authenticateUser,
  validate(getFollowersSchema),
  getFollowersHandler
);

//get followed users
authRoutes.get(
  "/followers/:id",
  authenticateUser,
  validate(getFollowedUsersSchema),
  getFollowedUserHandler
);


export default authRoutes;
