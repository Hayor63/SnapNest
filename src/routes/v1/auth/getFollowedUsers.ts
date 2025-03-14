import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserModel from "../../../database/models/user";
import UserRepo from "../../../database/repository/userRepo";

const getFollowedUserHandler = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;

    // Check if user exists
    const findUser = await UserRepo.getById(userId);
    if (!findUser) {
      return APIResponse.error("User not found", 404).send(res);
    }

    // Fetch following
    const followingIds = findUser.following || []; // Use `following`
    const following = await UserModel.find({
      _id: { $in: followingIds },
    }).select("_id username profilePicture bio");
    return APIResponse.success(
      {
        message: "Following list retrieved successfully",
        data: { following }, 
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getFollowedUserHandler;
