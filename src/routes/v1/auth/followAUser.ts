import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserModel from "../../../database/models/user";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const followUserHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
   
    const userId = req.user?._id;
    const followId = req.params.userId; 

    if (!userId || !followId) {
      return APIResponse.error("User parameters missing", 404).send(res);
    }

    if (userId === followId) {
      return APIResponse.error("You cannot follow yourself", 400).send(res);
    }

    const updatedUserPromise = UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { following: followId } }, // Changed to $addToSet to prevent duplicates
      { new: true }
    );

    const updatedFollowedUserPromise = UserModel.findByIdAndUpdate(
      followId,
      { $addToSet: { followers: userId } }, // Changed to $addToSet
      { new: true }
    );

    const [updatedUser, updatedFollowedUser] = await Promise.all([
      updatedUserPromise,
      updatedFollowedUserPromise,
    ]);

    return APIResponse.success(
      {
        message: "Following user successful",
        data: { updatedUser, updatedFollowedUser },
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};


export default followUserHandler
