import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import { updateCommentSchemaType } from "../../../validationSchema.ts/comment";
import CommentRepo from "../../../database/repository/commentRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const updateCommentHandler = async (
  req: AuthenticatedRequest & Request<updateCommentSchemaType["params"], {}, updateCommentSchemaType["body"]>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    // Use authenticated user's ID
    const userId = req.user?._id;
    if (!userId) {
      return APIResponse.error("Unauthorized access", 401).send(res);
    }
    
    const updatedComment = await CommentRepo.updateComment(id, userId, updatedData);
    if (!updatedComment) {
      return APIResponse.error("Comment not found", 404).send(res);
    }
    
    // Ensure the comment belongs to the authenticated user
    if (updatedComment.userId.toString() !== userId) {
      return APIResponse.error("You can only update your comment", 403).send(res);
    }
    
    return APIResponse.success(
      { message: "Comment updated successfully", data: updatedComment },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default updateCommentHandler;
