import { Router } from "express";
import { CategoryController } from "./category.controller";

export const categoryRoutes = Router();
const controller = CategoryController();