import dotenv from "dotenv";
dotenv.config(); // Load environment variables at the top

import { v2 as cloudinary } from "cloudinary";

// Ensure Cloudinary credentials are set
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Error: Cloudinary credentials are missing! Check your .env file.");
  throw new Error("Cloudinary credentials are required but missing.");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
