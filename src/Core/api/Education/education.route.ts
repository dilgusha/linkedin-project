import { Router } from "express";
import { EducationController } from "./education.controller";
import { uploads } from "../../middlewares/multer.middleware";

export const educationRoutes = Router();
const controller = EducationController();

educationRoutes.post("/create", uploads.single("image"), controller.create);
educationRoutes.put("/update/:id",uploads.single("image"), controller.editEducation);
educationRoutes.delete("/delete/:id", controller.deleteEducation);
educationRoutes.get("/getUserEducation",controller.getUserEducation)