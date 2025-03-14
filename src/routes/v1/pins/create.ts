import { Request, Response } from "express";
import PinRepo from "../../../database/repository/pinRepo";
import APIResponse from "../../../utils/api";
import UserModel from "../../../database/models/user";
import { DocumentType } from "@typegoose/typegoose";
import { Pin } from "../../../database/models/pin";
import mongoose from "mongoose";
import cloudinary from "../../../services/cloudinary";  // Assuming you have Cloudinary service set up
import UserRepo from "../../../database/repository/userRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const createPinHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
      return APIResponse.error("Pin data is required", 400).send(res);
    }

    const userId = req.user?._id;
    if (!userId) {
      return APIResponse.error("User not authenticated", 401).send(res);
    }

    // Check if the user exists and is verified
    const user = await UserRepo.getById(userId);
    if (!user) {
      return APIResponse.error("Invalid userId: User does not exist", 400).send(
        res
      );
    }
    if (!user.isVerified) {
      return APIResponse.error(
        "Email not verified, please verify to create a pin",
        401
      ).send(res);
    }

    // Prepare pin data
    const { image, title, description, tags } = req.body;

    // If an image was provided, upload it to Cloudinary
    let imageUrl = "";
    if (image) {
      // Check if the image is a URL or file
      if (image.startsWith("http")) {
        // If the image is a URL
        imageUrl = image;
      } else {
        // check if the image is a file
        const result = await cloudinary.uploader.upload(image, {
          folder: "pins", 
        });
        imageUrl = result.secure_url;
      }
    }

    // Prepare the pin data
    const pinData = {
      userId: new mongoose.Types.ObjectId(userId),
      image: imageUrl, 
      title,
      description,
      tags: tags || [],
    };

    // Create the pin in the database
    const pin = (await PinRepo.createPin(pinData)) as DocumentType<Pin>;

    return APIResponse.success(
      { message: "Pin created successfully", data: pin },
      201
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default createPinHandler;




