import { Router } from "express";
import { VacancyController } from "./vacancy.controller"; 
import { roleCheck, useAuth } from "../../middlewares/auth.middleware";
import { uploads } from "../../middlewares/multer.middleware";

export const vacancyRoutes = Router();
const controller = VacancyController();

vacancyRoutes.post("/create", uploads.single("image"), controller.create);
vacancyRoutes.delete("/delete/:id", controller.deletee);
vacancyRoutes.get("/get-by-user", controller.getByUser);
vacancyRoutes.get("/applied-vacancies", controller.getAppliedVacancies);