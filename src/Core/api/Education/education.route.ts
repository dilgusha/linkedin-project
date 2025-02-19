import { Router } from "express";
import { EducationController } from "./education.controller";
import { useAuth } from "../../middlewares/auth.middleware";
import { uploads } from "../../middlewares/multer.middleware";

export const educationRoutes = Router();
const controller = EducationController();

educationRoutes.post("/create", useAuth, uploads.single("image"), controller.create);
educationRoutes.delete("/delete", useAuth, controller.deleteEducation);

