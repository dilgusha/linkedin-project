import { Router } from "express";
import { ConnectionController } from "./connection.controller";

export const connectionRoutes = Router();
const controller = ConnectionController();