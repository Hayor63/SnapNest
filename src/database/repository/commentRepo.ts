import { CommentSchemaType } from "../../validationSchema.ts/comment";
import CommentModel, { Comment } from "../models/comment";

export default class CommentRepo {
  static createAComment: (
    comment: Omit<Comment, "likes" | "likeCount">
  ) => Promise<Comment> = async (comment) => {
    const data = await CommentModel.create(comment);
    return data;
  };

  // get Comments by Id
  static getCommentById: (commentId: string) => Promise<any> = async (
    commentId
  ) => {
    const data = await CommentModel.findById(commentId);
    return data;
  };


  //get all Comments
  static getAllComments = async () => {
    return await CommentModel.find().lean();
  };

  //update comment
  static updateComment: (
    id: string,
    userId: any,
    updateParams: Partial<CommentSchemaType>
  ) => Promise<any> = async (id, userId, updateParams) => {
    const comment = await CommentModel.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.userId.toString() !== userId.toString()) {
      throw new Error("You are not authorized to update this comment");
    }
    return await CommentModel.findByIdAndUpdate(id, updateParams, { new: true });
  };
  
}
