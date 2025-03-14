import { Request, Response, NextFunction } from "express";
import PinModel, { Pin } from "../../../database/models/pin";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repository/userRepo";

// Extend the Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const getFollowedPinsHandler = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    // Extract user id from the authenticated request
    const userId = req.user?._id;
    if (!userId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Retrieve the user document from the database
    const user = await UserRepo.getById(userId);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    // Use the user's following list 
     const subscribedPins = user.following || [];

    // pagination parameters from query string 
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skipCount = (page - 1) * limit;

    // Count total documents that match the filter
    const count = await PinModel.countDocuments({
      $or: [
        { userId: { $in: subscribedPins } },
        { userId: userId },
      ],
    });

    // Retrieve pins with filtering and pagination
    const pins = await PinModel.find({
      $or: [
        { userId: { $in: subscribedPins } },
        { userId: userId },
      ],
    })
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limit)
      .lean()
      .exec();

    const totalPages = Math.ceil(count / limit);
    const allPins = {
      currentPage: page,
      totalPages,
      pins,
    };

    return APIResponse.success(
      { message: "Pins retrieved successfully", data: allPins },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getFollowedPinsHandler;
