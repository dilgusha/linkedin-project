import { Router } from "express";
import { CategoryController } from "./category.controller";

export const categoryRoutes = Router();
const controller = CategoryController();

categoryRoutes.post("/create",  controller.createCategory);
categoryRoutes.delete("/delete/:id", controller.deletee);
categoryRoutes.get("/all", controller.getAll);
categoryRoutes.post("/update/:id",controller.updatedCategory)
categoryRoutes.get("/list", controller.categoryList)