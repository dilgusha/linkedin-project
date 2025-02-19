import { Router } from "express";
import { CategoryController } from "./category.controller";
import { roleCheck, useAuth } from "../../middlewares/auth.middleware";
import { ERoleType } from "../../app/enums";

export const categoryRoutes = Router();
const controller = CategoryController();

categoryRoutes.delete("/delete/:id", controller.deletee);
categoryRoutes.post(
  "/create",
  useAuth,
  roleCheck([ERoleType.ADMIN]),
  controller.createCategory
);
