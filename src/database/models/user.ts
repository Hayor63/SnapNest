import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose";
import * as argon2 from "argon2";

export const privateFields = ["password", "__v"];

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        privateFields.forEach(field => delete ret[field]);
      },
    },
    toObject: {
      transform: function (doc, ret) {
        privateFields.forEach(field => delete ret[field]);
      },
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})

@pre<User>("save", async function () {
  if (!this.isModified("password")) return;
  const hash = await argon2.hash(this.password);
  this.password = hash;
  return;
})

export class User {
  @prop({ required: true, unique: true })
  userName!: string;

  @prop({ required: true })
  password!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({
    required: true,
    default:
      "https://via.placeholder.com/150", // Use a proper direct image link
  })
  profilePicture!: string;

  @prop({ required: true, default: "Nothing to say yet" })
  bio!: string;

  @prop({ default: false })
  isVerified!: boolean;

  @prop({ default: "user" })
  role!: "user" | "admin";

  @prop({ type: () => [String], default: [] })
  followers!: string[];

  @prop({ type: () => [String], default: [] })
  following!: string[];

  async verifyPassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
      return false;
    }
  }
}

const UserModel = getModelForClass(User);
export default UserModel;
