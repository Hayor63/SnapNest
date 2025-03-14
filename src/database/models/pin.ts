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
  

  @modelOptions({
    schemaOptions: {
      timestamps: true,
    },
    options: {
      allowMixed: Severity.ALLOW,
    },
  })
  export class Pin {
    @prop({ ref: () => User, required: true })
    userId!: Ref<User>;
  
    @prop({ required: true })
    image!: string;
  
    @prop({ type: () => [String] })
    tags!: string[];
  
    @prop({ required: true, maxlength: 30 })
    title!: string;
    
    @prop({ required: true, maxlength: 300 })
    description!: string;
  
    @prop({ type: () => [String] })
    likes!: string[];
  }
  
  const PinModel = getModelForClass(Pin);
  export default PinModel;
  