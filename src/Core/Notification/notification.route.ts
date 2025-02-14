import { Router } from "express";
import { NotificationController } from "./notification.controller";

export const notificationRoutes = Router();
const controller = NotificationController();