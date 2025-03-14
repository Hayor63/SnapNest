import { Request, Response } from "express";
import { updatePinSchemaType } from "../../../validationSchema.ts/pin";
import APIResponse from "../../../utils/api";
import PinRepo from "../../../database/repository/pinRepo";
import UserRepo from "../../../database/repository/userRepo";
import { UpdateUserProfileSchemaType } from "../../../validationSchema.ts/user";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const updateUserHandler = async (
  req: AuthenticatedRequest &
    Request<UpdateUserProfileSchemaType["params"], {}, UpdateUserProfileSchemaType["body"]>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Check if any parameters were provided
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return APIResponse.error("Parameters missing", 400).send(res);
    }

    // userId retrieved from authentication middleware 
    const userId = req.user?._id;
    if (!userId) {
      return APIResponse.error("Unauthorized access", 401).send(res);
    }

    const updatedUser = await UserRepo.updateUser(id, updatedData, userId,);

    if (!updatedUser) {
      return APIResponse.error("User not found", 404).send(res);
    }

    return APIResponse.success(
      { message: "User updated successfully", data: updatedUser },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default updateUserHandler;
