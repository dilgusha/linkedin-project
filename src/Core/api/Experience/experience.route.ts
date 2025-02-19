import { Router } from "express";
import { ExperinceController } from "./experience.controller";
import { useAuth } from "../../middlewares/auth.middleware";

export const experienceRoutes = Router();
const controller = ExperinceController();

experienceRoutes.post("/create", useAuth, controller.create);