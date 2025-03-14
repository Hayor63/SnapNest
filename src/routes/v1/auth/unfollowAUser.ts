import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserModel from "../../../database/models/user"; // Ensure correct import

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

const unfollowUserHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    const followId = req.params.userId;

    if (!userId || !followId) {
      return APIResponse.error("User parameters missing", 400).send(res);
    }

    if (userId === followId) {
      return APIResponse.error("You cannot unfollow yourself", 400).send(res);
    }

    const updatedUserPromise = UserModel.findByIdAndUpdate(
      userId,
      { $pull: { following: followId } },
      { new: true }
    );

    const updatedUnFollowedUserPromise = UserModel.findByIdAndUpdate(
      followId,
      { $pull: { followers: userId } },
      { new: true }
    );

    const [updatedUser, updatedUnFollowedUser] = await Promise.all([
      updatedUserPromise,
      updatedUnFollowedUserPromise,
    ]);

    return APIResponse.success(
      {
        message: "User unfollowed successfully",
        data: { updatedUser, updatedUnFollowedUser },
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default unfollowUserHandler;
