import { Request, Response } from "express";
import PinRepo from "../../../database/repository/pinRepo";
import APIResponse from "../../../utils/api";
import PinModel from "../../../database/models/pin";

const getRelatedPinHandler = async (
    req: Request<{ id: string }, {}>,
    res: Response
  ) => {
    const { id } = req.params;
    const pin = await PinRepo.findById(id);
    if (!pin) {
      return APIResponse.error("Pin not found", 404).send(res);
    }
    
    const getTags = pin.tags; 
    const allPins = await PinModel.aggregate([{ $sample: { size: 10 } }]);
    
    // Filter for pins that share at least one tag with the original pin
    const relatedPins = allPins.filter(
      (p) => p.tags.some((tag: string) => getTags.includes(tag))
    );
  
    return APIResponse.success(
      { message: "Pins retrieved successfully", data: relatedPins },
      200
    ).send(res);
  };
  
  export default getRelatedPinHandler;