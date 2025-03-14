import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import CommentModel from "../../../database/models/comment";
import PinRepo from "../../../database/repository/pinRepo";

const getCommentsHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id: pinId } = req.params;
    console.log("Received pinId:", pinId);
    if (!pinId) {
      return APIResponse.error("PinId is missing", 400).send(res);
    }

    const pin = await PinRepo.findById(pinId);
    if (!pin) {
      return APIResponse.error("Pin not found", 404).send(res);
    }

    // Retrieve all comments attached to the pin, with population and sorting
    const comments = await CommentModel.find({ pinId: pinId })
      .populate("userId", "userName profilePhoto")
      .sort({ _id: -1 })
      .lean()
      .exec();

    if (!comments || comments.length === 0) {
      return APIResponse.error("No comments found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Comments retrieved successfully", data: comments },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getCommentsHandler;
