import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import PinRepo from "../../../database/repository/pinRepo";


interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const deleteTagHandler = async (
  req: AuthenticatedRequest & Request<{ id: string }, {}>,
  res: Response
) => {
  try {
    const { id: pinId, index } = req.params;
    const tagIndex = parseInt(index);

    // Ensure authenticated user exists
    if (!req.user) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Get the pin from the repository
    const pin = await PinRepo.findById(pinId);
    if (!pin) {
      return APIResponse.error("Pin not found", 404).send(res);
    }

    const getTags = [...pin.tags];
    getTags.splice(tagIndex, 1);
    await PinRepo.updatePin(pinId, req.user._id, { tags: getTags });
    return APIResponse.success(
      { message: "Tag deleted ", data: pin },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deleteTagHandler;
