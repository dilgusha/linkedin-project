import { Router } from "express";
import { CategoryController } from "./category.controller";

export const categoryRoutes = Router();
const controller = CategoryController();

categoryRoutes.post("/create",  controller.createCategory);
categoryRoutes.delete("/delete/:id", controller.deletee);
categoryRoutes.get("/all", controller.getAll);
categoryRoutes.put("/update/:id",controller.updatedCategory)
categoryRoutes.get("/list", controller.categoryList)