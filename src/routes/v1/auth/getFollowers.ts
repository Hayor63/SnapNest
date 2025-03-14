import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserModel from "../../../database/models/user";
import UserRepo from "../../../database/repository/userRepo";

const getFollowersHandler = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;

    // Check if user exists
    const findUser = await UserRepo.getById(userId);
    if (!findUser) {
      return APIResponse.error("User not found", 404).send(res);
    }

    // Fetch followers 
    const followerIds = findUser.followers; // Array of follower IDs
    const followers = await UserModel.find({ _id: { $in: followerIds } })
      .select("_id username profilePicture bio"); // Limit returned fields

    return APIResponse.success(
      {
        message: "Followers retrieved successfully",
        data: { followers }, // Use "followers" instead of "user"
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getFollowersHandler;
