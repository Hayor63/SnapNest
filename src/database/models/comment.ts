import {
    DocumentType,
    getModelForClass,
    modelOptions, 
    pre,
    prop,
    Ref,
    Severity,
  } from "@typegoose/typegoose";
  import { User } from "./user";
  import { Pin } from "./pin";
  
  // Apply the model options using the decorator
  @modelOptions({
    schemaOptions: {
      timestamps: true,
    },
    options: {
      allowMixed: Severity.ALLOW,
    },
  })
 
  export class Comment {
    @prop({ ref: () => User, required: true })
    userId!: Ref<User>;
  
    @prop({ ref: () => Pin, required: true })
    pinId!: Ref<Pin>;
  
    @prop({ required: true })
    comment!: string;

    @prop({ type: () => [String] })
    likes!: string[];
  
    @prop({ required: true, default: 0 })
    likeCount?: number;
  }
  
  
  const CommentModel = getModelForClass(Comment);
  export default CommentModel;
  