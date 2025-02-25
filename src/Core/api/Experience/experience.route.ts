import { Router } from "express";
import { ExperinceController } from "./experience.controller";

export const experienceRoutes = Router();
const controller = ExperinceController();

experienceRoutes.post("/create", controller.create);
experienceRoutes.get("/get-experiences", controller.getUserExperience);
experienceRoutes.put("/update", controller.update);
experienceRoutes.delete("/delete/:id",controller.deleteExperience);