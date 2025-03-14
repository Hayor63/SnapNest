
import multer from "multer";
import { Request } from "express";

// Use memoryStorage instead of diskStorage (better for Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB file size limit
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    // Allow only JPEG and PNG files
    if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
      return cb(new Error("Only JPEG and PNG files are allowed"));
    }
    cb(null, true);
  },
});


export default upload;
