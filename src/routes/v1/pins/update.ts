import { Request, Response } from "express";
import { updatePinSchemaType } from "../../../validationSchema.ts/pin";
import APIResponse from "../../../utils/api";
import PinRepo from "../../../database/repository/pinRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const updatePinHandler = async (
  req: AuthenticatedRequest &
    Request<updatePinSchemaType["params"], {}, updatePinSchemaType["body"]>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // userId retrieved from authentication middleware 
    const userId = req.user?._id;
    if (!userId) {
      return APIResponse.error("Unauthorized access", 401).send(res);
    }

    const updatedPin = await PinRepo.updatePin(id, userId, updatedData);

    if (!updatedPin) {
      return APIResponse.error("Pin could not be updated", 404).send(res);
    }

    return APIResponse.success(
      { message: "Pin updated successfully", data: updatedPin },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default updatePinHandler;
