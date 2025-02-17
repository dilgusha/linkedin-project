import { Router } from "express";
import { MessageController } from "./message.controller";

export const messageRoutes = Router();
const controller = MessageController();