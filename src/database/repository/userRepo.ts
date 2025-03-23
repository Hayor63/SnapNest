import { DocumentType } from "@typegoose/typegoose";
import UserModel, { User } from "../models/user";
import TokenModel from "../models/token";
import PinModel from "../models/pin";

export default class UserRepo {
  static createUser: (
    user: Omit<
      User,
      | "verifyPassword"
      | "role"
      | "followers"
      | "following"
      | "bio"
      | "isVerified"
      | "profilePicture"
    >
  ) => Promise<User> = async (user) => {
    return await UserModel.create(user);
  };

  static findByEmail: (email: string) => Promise<DocumentType<User> | null> =
    async (email) => {
      return await UserModel.findOne({ email });
    };

    
  static findByUserName: (
    userName: string
  ) => Promise<DocumentType<User> | null> = async (userName) => {
    return await UserModel.findOne({ userName });
  };

 
   //get by Id
   static getById: (id: string) => Promise<any> = async (id) => {
    const data = await UserModel.findById(id);
    return data;
  };


  //verify Email
  static async verifyEmail(
    userId: string,
    token: string
  ): Promise<DocumentType<User> | null> {
    return await TokenModel.findOne({ userId, token });
  }

  //update user profile
  static updateUser: (
    id: string,
    updateParams: Partial<User>,
    userId: any
  ) => Promise<Omit<User, "password"> | null> = async (id, updateParams, userId) => {
    const { password, ...rest } = updateParams;
  
    // Find the user by ID
    const user = await UserModel.findById(id);
    if (!user) return null;
  
    // Check if the authenticated user is allowed to update this user
    if (user._id.toString() !== userId.toString()) {
      throw new Error("You are not authorized to update this user");
    }
  
    // If updating the password, hash it (or perform necessary actions) and save
    if (password) {
      user.password = password;
      await user.save(); // Ensure we wait for password update
    }
  
    // Update user fields excluding password
    const updatedUser = await UserModel.findByIdAndUpdate(id, rest, {
      new: true, // Return updated user
      runValidators: true, // Ensure validation rules apply
    }).select("-password"); // Exclude password from the returned object
  
    return updatedUser;
  };
  
  



}
