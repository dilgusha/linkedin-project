import { Router } from "express";
import { ExperinceController } from "./experience.controller";
import { roleCheck, useAuth } from "../../middlewares/auth.middleware";

export const experienceRoutes = Router();
const controller = ExperinceController();

experienceRoutes.post("/create", useAuth, controller.create);
experienceRoutes.get("/get-experiences", useAuth, controller.getUserExperience);
experienceRoutes.put("/update", useAuth, controller.update);
experienceRoutes.delete("/delete/:id",useAuth,controller.deleteExperience);