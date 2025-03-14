import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import PinRepo from "../../../database/repository/pinRepo";
import { getSinglePinSchemaType } from "../../../validationSchema.ts/pin";

const getSinglePinHandler = async (
  req: Request<{ id: string }, {}, getSinglePinSchemaType >,
  res: Response
) => {
  try {
    const { id } = req.params;
    //check if Pin is available
    const singlePins = await PinRepo.findById(id);
    if (!singlePins) {
      return APIResponse.error("Pin not found", 404).send(res);
    }
    return APIResponse.success(
      { message: "Pin retrieved successfully", data: singlePins },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getSinglePinHandler;
