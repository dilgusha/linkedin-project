import { Router } from "express";
import { useAuth } from "../../middlewares/auth.middleware";
import { uploads } from "../../middlewares/multer.middleware";
import { UploadController } from "./upload.controller";

export const uploadRoutes = Router();
const controller = UploadController();

uploadRoutes.post("/create", useAuth, uploads.single("image"), controller.uploadImage);
uploadRoutes.delete("/delete", useAuth,  controller.deleteImage);

