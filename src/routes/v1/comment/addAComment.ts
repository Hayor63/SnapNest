import { Request, Response } from "express";
import UserModel from "../../../database/models/user";
import APIResponse from "../../../utils/api";
import CommentRepo from "../../../database/repository/commentRepo";
import mongoose from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { Comment } from "../../../database/models/comment";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const addACommentHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Use the authenticated user's ID
    const authUserId = req.user?._id;
    if (!authUserId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Check if the authenticated user exists and is verified
    const user = await UserModel.findById(authUserId);
    if (!user) {
      return APIResponse.error("Invalid userId: User does not exist", 400).send(res);
    }
    if (!user.isVerified) {
      return APIResponse.error("Email not verified, please verify to comment", 401).send(res);
    }

    // Retrieve pinId from the route parameters instead of the body
    const { id: pinId } = req.params; 
    if (!pinId) {
      return APIResponse.error("Pin ID is missing", 400).send(res);
    }

    // Get the comment text from the request body
    const { comment: commentText } = req.body;
    if (!commentText) {
      return APIResponse.error("Comment is missing", 400).send(res);
    }

    // Create the comment data using the authenticated userId and pinId from the route
    const commentData = {
      userId: new mongoose.Types.ObjectId(authUserId),
      pinId: new mongoose.Types.ObjectId(pinId),
      comment: commentText,
    };

    const createdComment = (await CommentRepo.createAComment(commentData)) as DocumentType<Comment>;
    return APIResponse.success(
      { message: "Comment created successfully", data: createdComment },
      201
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default addACommentHandler;
