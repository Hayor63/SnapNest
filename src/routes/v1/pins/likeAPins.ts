import { Request, Response } from "express";
import PinModel from "../../../database/models/pin";
import APIResponse from "../../../utils/api";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const likeAPinHandler = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  const { id: pinId } = req.params;
  try {
    if (!userId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }
    const pin = await PinModel.findById(pinId);

    if (!pin) {
      return APIResponse.error("Pin not found", 404).send(res);
    }

    // Checking if user already liked the pin
    if (pin.likes.includes(userId)) {
      return APIResponse.error("You already liked this pin", 400).send(res);
    }

    // update the pin by adding the userId to likes
    const updatedPin = await PinModel.findByIdAndUpdate(
      pinId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    return APIResponse.success(
      { message: "Pin liked", data: updatedPin },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default likeAPinHandler;
