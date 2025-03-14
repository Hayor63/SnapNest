import { Request, Response } from "express";
import CommentModel from "../../../database/models/comment";
import APIResponse from "../../../utils/api";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const disLikeACommentHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?._id;
  const { id: commentId } = req.params;

  try {
    if (!userId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }
  
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return APIResponse.error("Comment not found", 404).send(res);
    }

    // Check if the user has liked the comment
    if (!(comment.likes ?? []).includes(userId)) {
      return APIResponse.error("You haven't liked this comment", 400).send(res);
    }

    // Updating the comment by removing the userId from likes and decrementing likeCount
    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      {
        $pull: { likes: userId },
        $inc: { likeCount: -1 },
      },
      { new: true }
    );

    return APIResponse.success(
      { message: "Comment disliked", data: updatedComment },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default disLikeACommentHandler;
