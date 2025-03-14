import NodeCache from "node-cache";
import APIResponse from "../../../utils/api";
import { Request, Response } from "express";
import PinModel from "../../../database/models/pin";

const cache = new NodeCache({ stdTTL: 600 });

const getTagsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheTags = cache.get("tags");

    // Check if cached data exists
    if (cacheTags) {
      return APIResponse.success(
        { message: "Tags retrieved from cache", data: cacheTags },
        200
      ).send(res);
    }

    // Fetch all pins from the database
    const getPins = await PinModel.find();

    // Extract tags and ensure they are arrays
    const filterTags = getPins.flatMap((pin) => Array.isArray(pin.tags) ? pin.tags : []);

    // Generate random tags (limit to 40)
    const randomTags = filterTags
      .sort(() => Math.random() - 0.5)
      .slice(0, 40);

    // Remove duplicates and empty tags
    const removeTagsDuplicates = randomTags.filter((tag, i, arr) => {
      return arr.indexOf(tag) === i && tag.trim().length > 0;
    });

    console.log(removeTagsDuplicates);

    // Cache the result
    cache.set("tags", removeTagsDuplicates);

    return APIResponse.success(
      { message: "Tags retrieved successfully", data: removeTagsDuplicates },
      200
    ).send(res);

  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default getTagsHandler;
