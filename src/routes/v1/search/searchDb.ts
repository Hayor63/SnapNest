import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserModel, { User } from "../../../database/models/user";
import PinModel, { Pin } from "../../../database/models/pin";

// Extend the Request interface to include user authentication details
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string; // The authenticated user's ID (if available)
  };
}

// Handles search requests for users and pins
const searchDbHandler = async (
  req: AuthenticatedRequest & Request<{}, {}, {}, { q: string }>, // Request expects a query parameter `q`
  res: Response
) => {
  try {
    // Extract the search query from request parameters
    const query = req.query.q;

    // If no query is provided, return an error response
    if (!query) {
      return APIResponse.error("Search parameter is missing", 400).send(res);
    }

    // Process the query: If it contains commas, split it into an array of trimmed tags
    const searchQuery = query.includes(",")
      ? query.split(",").map((tag) => tag.trim()) // Convert string to an array of trimmed tags
      : query.trim(); // Otherwise, keep it as a single trimmed string

    // Search for users where the username matches the query (case-insensitive)
    const userResult = await UserModel.find({
      userName: { $regex: searchQuery, $options: "i" }, // "i" makes it case-insensitive
    });

    // Search for pins where:
    // - The title or description matches the query (case-insensitive)
    // - OR any of the tags include the search query (if it's an array, check each tag)
    const pinResult = await PinModel.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { tags: { $in: Array.isArray(searchQuery) ? searchQuery : [searchQuery] } },
      ],
    });

    // Combine user and pin search results into a single array
    type SearchResult = User | Pin;
    const searchResult: SearchResult[] = [...userResult, ...pinResult];

    // Return a success response with the search results
    return APIResponse.success(
      { message: "Search results", data: searchResult },
      200
    ).send(res);
  } catch (error) {
    // Handle errors gracefully and return a server error response
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default searchDbHandler;
