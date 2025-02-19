import { Router } from "express";
import { VacancyController } from "./vacancy.controller"; 
import { roleCheck, useAuth } from "../../middlewares/auth.middleware";
import { uploads } from "../../middlewares/multer.middleware";

export const vacancyRoutes = Router();
const controller = VacancyController();

vacancyRoutes.post("/create", useAuth, roleCheck(["COMPANY"]), uploads.single("image"), controller.create);
vacancyRoutes.delete("/delete/:id", useAuth, roleCheck(["COMPANY"]),  controller.deletee);
vacancyRoutes.get("/get-by-user", useAuth, roleCheck(["COMPANY"]),  controller.getByUser);