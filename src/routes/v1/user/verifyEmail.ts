import { Request, Response } from "express";
import Token from "../../../database/models/token";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repository/userRepo";

// Function to verify if the provided token exists in the database
const verifyToken = async (userId: string, token: string) => {
  console.log(
    "Checking token in database for userId:",
    userId,
    "and token:",
    token
  );

  const storedToken = await Token.findOne({ userId });

  console.log("Stored Token in DB:", storedToken);

  if (!storedToken) {
    console.log("Token not found in the database.");
    return null;
  }

  // If tokens are hashed before storage, compare them properly
  if (storedToken.token !== token) {
    console.log(
      "Token mismatch! Stored:",
      storedToken.token,
      "Received:",
      token
    );
    return null;
  }

  return storedToken;
};

const tokenHandler = async (req: Request, res: Response) => {
  try {
    console.log("Received request params:", req.params);
    const { userId, token } = req.params;
    console.log("Extracted userId:", userId);
    console.log("Extracted token:", token);

    // Validate if userId is present
    if (!userId) {
      return APIResponse.error("User ID is required", 400).send(res);
    }

    // Check if the user exists
    const userExists = await UserRepo.getById(userId);
    console.log("User found:", userExists);

    if (!userExists) {
      return APIResponse.error("Invalid userId: User does not exist", 400).send(res);
    }

    // Check if token is valid
    const getToken = await verifyToken(userId, token);
    console.log("token gotten", getToken);
    if (!getToken) {
      return APIResponse.error("Invalid or expired token", 401).send(res);
    }
    
    // update user as verified 

    userExists.isVerified = true;
    await userExists.save();

    // Send success response once verification is complete
    return APIResponse.success(
      { message: "Account verified successfully" },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default tokenHandler;
