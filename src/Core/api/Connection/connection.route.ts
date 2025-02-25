import { Router } from "express";
import { ConnectionController } from "./connection.controller";

export const connectionRoutes = Router();
const controller = ConnectionController();

connectionRoutes.get("/send/request/:id", controller.sendConnectionRequest)
connectionRoutes.get("/accept/:id", controller.acceptConnection)
connectionRoutes.get("/reject/:id", controller.rejectConnection)
connectionRoutes.get("/list", controller.list)