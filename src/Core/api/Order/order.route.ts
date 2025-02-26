import { Router } from "express";
import { OrderController } from "./order.controller";

export const orderRoutes = Router();
const controller = OrderController();

orderRoutes.post("/create", controller.createOrder);