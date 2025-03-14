import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import PinRepo from "../../../database/repository/pinRepo";
import CommentModel from "../../../database/models/comment";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const deletePinHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: pinId } = req.params;

    // Ensure authenticated user exists
    if (!req.user) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Get the pin from the repository
    const pin = await PinRepo.findById(pinId);
    if (!pin) {
      return APIResponse.error("Pin not found", 404).send(res);
    }

    // Check if the authenticated user is the owner of the pin
    if (pin.userId.toString() !== req.user._id) {
      return APIResponse.error("You can only delete your pin", 403).send(res);
    }

    await CommentModel.deleteMany({ pinId });

    // Delete the pin itself
    await PinRepo.deletePin(pinId)

    return APIResponse.success(
      { message: "Pin deleted ", data: pin },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deletePinHandler;
