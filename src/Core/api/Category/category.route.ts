import { Router } from "express";
import { CategoryController } from "./category.controller";
import { roleCheck, useAuth } from "../../middlewares/auth.middleware";
import { ERoleType } from "../../app/enums";

export const categoryRoutes = Router();
const controller = CategoryController();

categoryRoutes.post("/create",  useAuth,  roleCheck([ERoleType.ADMIN]),  controller.createCategory);
categoryRoutes.delete("/delete/:id", controller.deletee);
categoryRoutes.get("/all", controller.getAll);
categoryRoutes.post("/updated category",useAuth,controller.updatedCategory)
