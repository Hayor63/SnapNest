import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import CommentRepo from "../../../database/repository/commentRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const deleteCommentHandler = async (
  req: AuthenticatedRequest & Request<{ id: string }, {}>,
  res: Response
) => {
  try {
    const { id: commentId } = req.params;

    // Ensure authenticated user exists
    if (!req.user) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Get the comment from the repository
    const comment = await CommentRepo.getCommentById(commentId);
    if (!comment) {
      return APIResponse.error("Comment not found", 404).send(res);
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.userId.toString() !== req.user._id) {
      return APIResponse.error("You can only delete your comment", 403).send(res);
    }

    // Delete the comment itself
    await comment.deleteOne();

    return APIResponse.success(
      { message: "comment deleted ", data: comment },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default deleteCommentHandler;
