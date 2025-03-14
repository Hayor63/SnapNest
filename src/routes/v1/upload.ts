// import { Request, Response, NextFunction } from "express";
// import cloudinary from "../../services/cloudinary"; // Ensure correct path

// const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
//       res.status(400).json({ error: "No files uploaded" }); // ✅ No return statement
//       return;
//     }

//     const uploadedImages = await Promise.all(
//       (req.files as Express.Multer.File[]).map(async (file) => {
//         return new Promise<string>((resolve, reject) => {
//           const uploadStream = cloudinary.uploader.upload_stream(
//             { folder: "uploads" },
//             (error, result) => {
//               if (error) return reject(new Error("Upload to Cloudinary failed"));
//               if (result?.secure_url) resolve(result.secure_url);
//             }
//           );
//           uploadStream.end(file.buffer);
//         });
//       })
//     );

//     res.status(200).json({ urls: uploadedImages }); // ✅ No return statement
//   } catch (error) {
//     next(error); // ✅ Pass error to Express error handler
//   }
// };

// export default uploadToCloudinary;


// import { Request, Response, NextFunction } from "express";
// import cloudinary from "../../services/cloudinary"; // Ensure correct path

// const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { imageUrl } = req.body; // Get image URL from request body

//     if (!imageUrl) {
//       return res.status(400).json({ error: "No image URL provided" });
//     }

//     const result = await cloudinary.uploader.upload(imageUrl, { folder: "uploads" });

//     res.status(200).json({ url: result.secure_url });
//   } catch (error) {
//     next(error);
//   }
// };

// export default uploadToCloudinary;

import { Request, Response, NextFunction } from "express";
import cloudinary from "../../services/cloudinary"; // Import Cloudinary service
import APIResponse from "../../utils/api"; // Import APIResponse helper

const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // ✅ Upload from a URL if provided
    if (req.body.imageUrl) {
      const result = await cloudinary.uploader.upload(req.body.imageUrl, { folder: "uploads" });
      return APIResponse.success({ message: "Image uploaded successfully", url: result.secure_url })
        .send(res);
    }

    // ✅ Upload files from user's device
    if (req.files && req.files instanceof Array) {
      const uploadedImages = await Promise.all(
        (req.files as Express.Multer.File[]).map(async (file) => {
          return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "uploads" },
              (error, result) => {
                if (error) return reject(new Error("Upload to Cloudinary failed"));
                if (result?.secure_url) resolve(result.secure_url);
              }
            );
            uploadStream.end(file.buffer);
          });
        })
      );
      return APIResponse.success({ message: "Files uploaded successfully", urls: uploadedImages })
        .send(res);
    }

    //  No file or URL provided
    return APIResponse.error("No file or image URL provided", 400).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default uploadToCloudinary;



