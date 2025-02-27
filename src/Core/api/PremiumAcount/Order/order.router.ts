import { Router } from "express";
import { OrderController } from "./order.controller";
import { useAuth } from "../../../middlewares/auth.middleware";

export const orderRouters = Router();
const controller = OrderController();

orderRouters.post('/create' , useAuth, controller.createOrder);
orderRouters.get('/list' , useAuth, controller.listOrder);
