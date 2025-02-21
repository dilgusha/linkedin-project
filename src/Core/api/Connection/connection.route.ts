import { Router } from "express";
import { ConnectionController } from "./connection.controller";
import { useAuth } from "../../middlewares/auth.middleware";

export const connectionRoutes = Router();
const controller = ConnectionController();

connectionRoutes.get("/send/request/:id", useAuth, controller.sendConnectionRequest)
connectionRoutes.get("/accept/:id", useAuth, controller.acceptConnection)