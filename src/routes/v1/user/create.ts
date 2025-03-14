import { Request, Response } from "express";
import { UserSchemaType } from "../../../validationSchema.ts/user";
import userRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import { User } from "../../../database/models/user";
import JWTRepo from "../../../database/repository/JWTRepo";
import TokenModel from "../../../database/models/token";
import config from "../../../../config/default";
import sendEmail from "../../../services/sendMail";
import { DocumentType } from "@typegoose/typegoose";

const createUserHandler = async (
  req: Request<{}, {}, UserSchemaType>,
  res: Response
) => {
  try {
    const { email, userName } = req.body;

    const currentEmail = await userRepo.findByEmail(email);
    if (currentEmail) {
      return APIResponse.error("User with this email already exists!", 400).send(
        res
      );
    }

    const currentUserName = await userRepo.findByUserName(userName);
    if (currentUserName) {
      return APIResponse.error("Username already exists!", 400).send(res);
    }

    const user = (await userRepo.createUser(req.body)) as DocumentType<User>;
    if (!user || !user._id) {
      return APIResponse.error("Failed to create user").send(res);
    }

    const verificationToken = JWTRepo.signEmailVerificationToken(
      user._id.toString(),
      user.email
    );

    const messageLink = `${config.baseUrl}/verify-email?token=${verificationToken}`;

    const emailSent = await sendEmail({
      userName: user.userName,
      from: config.userMailLogin,
      to: user.email,
      subject: "Email Verification Link",
      text: `Hello ${user.userName}, please verify your email by clicking on this link: ${messageLink}.
               Link expires in 30 minutes.`,
    });

    if (!emailSent.success) {
      console.error("Email sending failed:", emailSent);
      return APIResponse.error("Failed to send verification email").send(res);
    }

    // Save token in database only if email was sent
    await TokenModel.create({ userId: user._id, token: verificationToken });
    return APIResponse.success(
      { message: "User registration successfull" },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default createUserHandler;
