import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";


const getUserProfileHandler = async (req: Request, res: Response) => {
  try {
    // Ensure userName is taken from req.params
    const { userName } = req.params;

    if (!userName) {
      return APIResponse.error("UserName is required").send(res);
    }

    // Fetch user by username
    const user = await UserRepo.findByUserName(userName);

    if (!user) {
      return APIResponse.error(`User with username '${userName}' not found`).send(res);
    }

    // Return success response
    return APIResponse.success(user, 200).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default getUserProfileHandler;



