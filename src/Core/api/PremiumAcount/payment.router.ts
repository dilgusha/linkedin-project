import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { useAuth } from "../../middlewares/auth.middleware";

export const paymentRouters = Router();
const controller = PaymentController();

paymentRouters.post('/create' , useAuth, controller.createPayment);
paymentRouters.get('/list' , useAuth, controller.listPayment);
paymentRouters.get('/:id' , useAuth, controller.getPaymentId)