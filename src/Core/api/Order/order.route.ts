import { Router } from "express";
import { OrderController } from "./order.controller";

export const orderRoutes = Router();
const controller = OrderController();

orderRoutes.post("/create:id", controller.createOrder);
//http://localhost:8080/api/v1/order/finish/:status
orderRoutes.get("/finish/:status", controller.finishOrder);
orderRoutes.get("/subscription/types", controller.subscriptionType);
