import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";
import pinRoutes from "./pins";
import commentRoutes from "./comment";
import searchRoutes from "./search";
import uploadToCloudinary from "./upload";
import upload from "../../utils/multer";

const router = Router()
router.use("/users", userRoutes)
router.use("/auth", authRoutes)
router.use("/pins", pinRoutes)
router.use("/comments", commentRoutes)
router.use("/search", searchRoutes)
router.post("/upload", upload.array("files", 5), uploadToCloudinary);


export default router



