import { Request, Response, NextFunction } from "express";
import PinModel, { Pin } from "../../../database/models/pin";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repository/userRepo";

const getPinsByUserHandler = async (
    req: Request<{ id: string }, {}>,
    res: Response
  ) => {
  try {
    const { id } = req.params;
    // Retrieve the user document from the database
    const user = await UserRepo.getById(id);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }
    // pagination parameters from query string
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skipCount = (page - 1) * limit;

    
    const count = await PinModel.countDocuments();
    // Retrieve pins with filtering and pagination
    const pins = await PinModel.find({ userId: user._id })
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);

    const totalPages = Math.ceil(count / limit);
    if (!pins) {
        return APIResponse.error("Pins not found", 404).send(res);
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

export default getPinsByUserHandler;
