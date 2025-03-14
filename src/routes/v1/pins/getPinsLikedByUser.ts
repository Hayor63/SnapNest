import { Request, Response } from "express";
import PinModel from "../../../database/models/pin";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repository/userRepo";

// interface QueryParams {
//   page?: string;
//   limit?: string;
// }

const getPinsLikedByUserHandler = async (
  req: Request<{ id: string }, {}>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await UserRepo.getById(id)
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    // Define pagination parameters from query string or use defaults
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skipCount = (page - 1) * limit;

    // Count only pins liked by the user
    const count = await PinModel.countDocuments({ likes: user._id });

    // Retrieve pins liked by the user with filtering and pagination
    const pins = await PinModel.find({ likes: user._id })
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limit);

    const totalPages = Math.ceil(count / limit);

    if (pins.length === 0) {
      return APIResponse.error("No pins found", 404).send(res);
    }

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

export default getPinsLikedByUserHandler;
