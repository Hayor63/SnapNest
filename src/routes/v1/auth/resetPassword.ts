import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import TokenModel from "../../../database/models/token";
import UserModel from "../../../database/models/user";
import argon2 from "argon2";

const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { id: userId, token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return APIResponse.error(
        "Invalid parameters, token may be broken",
        400
      ).send(res);
    }

    // Find user
    const user = await UserRepo.getById(userId);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    // Check if token exists and is valid
    const getToken = await TokenModel.findOne({ userId, token });
    console.log("Tokenss", getToken);
    if (!getToken) {
      return APIResponse.error("Invalid or expired token", 400).send(res);
    }

    // Hash the new password using Argon2
    const hashedPassword = await argon2.hash(password);

    // Update user's password
    await UserModel.updateOne({ _id: user._id }, { password: hashedPassword });

    return APIResponse.success("Password updated successfully", 200).send(res);
  } catch (error) {
    console.error("Recover password error:", error);
    return APIResponse.error(
      "Something went wrong, please try again",
      500
    ).send(res);
  }
};

export default resetPasswordHandler;
