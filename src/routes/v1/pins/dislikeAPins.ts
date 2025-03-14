import { Request, Response } from "express";
import PinModel from "../../../database/models/pin";
import APIResponse from "../../../utils/api";
import PinRepo from "../../../database/repository/pinRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const disLikeAPinHandler = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  const { id: pinId } = req.params;
  try {
    // Ensure the user is authenticated before proceeding
    if (!userId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }
    const pin = await PinRepo.findById(pinId);

    if (!pin) {
      return APIResponse.error("Pin not found", 404).send(res);
    }
    // updating the pin by adding the userId to likes
    const updatedPin = await PinModel.findByIdAndUpdate(
      pinId,
      { $pull: { likes: userId } },
      { new: true }
    );

    return APIResponse.success(
      { message: "Pin disliked", data: updatedPin },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default disLikeAPinHandler;
