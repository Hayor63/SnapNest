import { Request, Response } from "express";
import { LoginSchemaType } from "../../../validationSchema.ts/user";
import UserRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import JWTRepo from "../../../database/repository/JWTRepo";
import { formatResponseRecord } from "../../../utils/formatter";

const loginHandler = async (
  req: Request<{}, {}, LoginSchemaType>,
  res: Response
) => {
  const { userName, password } = req.body;

  try {
    const existingUser = await UserRepo.findByUserName(userName);
    if (!existingUser) {
      return APIResponse.error("User does not exist").send(res);
    }

    // verify Password
    const isUserPassword = await existingUser.verifyPassword(password);

    if (!isUserPassword) {
      return APIResponse.error("Invalid email or password", 400).send(res);
    }

    // Generate JWT token
    const { password: _, ...rest } = existingUser.toObject();
    const accessToken = JWTRepo.signAccessToken(rest);

    // Return success response
    APIResponse.success(
      { accessToken, ...formatResponseRecord(rest) },
      200
    ).send(res);
  } catch (error) {
    APIResponse.error((error as Error).message).send(res);
  }
};

export default loginHandler