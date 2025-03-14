import { Request, Response, NextFunction } from "express";
import PinModel from "../../../database/models/pin";
import APIResponse from "../../../utils/api";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 100 });

const getRandomPinsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Define pagination parameters
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skipCount = (page - 1) * limit;
    const cacheKey = `randomPins_${page}_${limit}`;

    // Check cache first
    const cachedPins = cache.get(cacheKey);
    if (cachedPins) {
      return APIResponse.success(
        { message: "Pins retrieved from cache", data: cachedPins },
        200
      ).send(res);
    }

    // Get total pin count
    const count = await PinModel.countDocuments();

    // Fetch and randomize pins
    let pins = await PinModel.aggregate([{ $sample: { size: count } }]);
    pins = pins.slice(skipCount, skipCount + limit);

    if (!pins.length) {
      return APIResponse.error("Pins not found", 404).send(res);
    }

    const totalPages = Math.ceil(count / limit);
    const allPins = {
      currentPage: page,
      totalPages: totalPages,
      pins: pins,
    };

    // Store data in cache
    cache.set(cacheKey, allPins);

    return APIResponse.success(
      { message: "Pins retrieved successfully", data: allPins },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getRandomPinsHandler;



