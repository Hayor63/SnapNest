import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const authenticateUserHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if the user is available in res.locals.user
      const user = req.user;
      if (!user) {
        return APIResponse.error("Unauthorized: No user ID provided").send(res);
      }
  
      const userId = user._id;
      const userFromDb = await UserRepo.getById(userId); 
  
      if (!userFromDb) {
        return APIResponse.error("User not found").send(res);
      }
  
      // Return success response
      return APIResponse.success(
        { message: "User authenticated successfully", data: userFromDb },
        200
      ).send(res);
    } catch (error) {
      return APIResponse.error((error as Error).message).send(res);
    }
  };
  

export default authenticateUserHandler;
