import { object, string, TypeOf } from "zod";

export const commentSchema = object({
  params: object({
    id: string({ required_error: "Pin ID is required" }).refine(
      (val) => /^[0-9a-fA-F]{24}$/.test(val),
      { message: "Invalid Pin ID format" }
    ),
  }),
  body: object({
    comment: string({ required_error: "Comment is required" }),
  }),
});


// get comment by Id
export const getCommentSchema = object({
  params: object({
    id: string({
      required_error: "pin ID is required",
    }),
  }),
});

//like a comment
export const likeCommentSchema = object({
  params: object({
    id: string().nonempty("comment ID is required"),
  }),
});

//dislike a comment
export const dislikeCommentSchema = object({
  params: object({
    id: string().nonempty("comment ID is required"),
  }),
});

// delete single pin
export const deleteSingleCommentSchema = object({
  params: object({
    id: string({
      required_error: "Pin ID is required",
    }),
  }),
});


//update Pin
export const updateCommentSchema = object({
  params: object({
    id: string({
      required_error: "Comment ID is required",
    }),
  }),
  body: object({
    comment: string({ required_error: "Comment is required" }),
  }),
});

export type CommentSchemaType = {
  params: TypeOf<typeof commentSchema>["params"];
  body: TypeOf<typeof commentSchema>["body"];
};
export type getCommentSchemaType = TypeOf<
  typeof getCommentSchema
>["params"];
export type likeCommentSchemaType = TypeOf<typeof likeCommentSchema>["params"];
export type dislikeCommentSchemaType = TypeOf<typeof dislikeCommentSchema>["params"];
export type deleteCommentSchemaType = TypeOf<
  typeof deleteSingleCommentSchema
>["params"];
export type updateCommentSchemaType = {
  params: TypeOf<typeof updateCommentSchema>["params"];
  body: TypeOf<typeof updateCommentSchema>["body"];
};
