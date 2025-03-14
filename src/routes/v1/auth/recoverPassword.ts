import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import JWTRepo from "../../../database/repository/JWTRepo";
import TokenModel from "../../../database/models/token";
import sendEmail from "../../../services/sendMail";
import config from "../../../../config/default";

const recoverPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await UserRepo.findByEmail(email);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    // Generate reset token
    const resetToken = JWTRepo.signResetToken(user._id.toString());

    // Store token in database
    const stored = await TokenModel.create({
      userId: user._id,
      token: resetToken, // Store JWT token
      expiresAt: Date.now() + 3600000, // 1 hour expiry
    });

    console.log("storedtokenss", stored)

    // Send email with reset link
    const resetLink = `${config.baseUrl}/reset-password/${user._id}/${resetToken}`;
    const emailSent = await sendEmail({
      userName: user.userName,
      from: config.userMailLogin,
      to: user.email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    // Ensure email was sent
    if (!emailSent?.success) {
      return APIResponse.error("Failed to send reset email").send(res);
    }

    return APIResponse.success("Password reset link sent to email", 200).send(
      res
    );
  } catch (error) {
    console.error("Recover password error:", error);
    return APIResponse.error("Something went wrong, please try again").send(
      res
    );
  }
};

export default recoverPasswordHandler;
