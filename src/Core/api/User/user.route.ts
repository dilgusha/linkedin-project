import { Router } from "express";
import { UserController } from "./user.controller";

export const userRoutes = Router();
const controller = UserController();

userRoutes.put('/update', controller.userEdit);
userRoutes.delete('/delete', controller.userDelete);
userRoutes.post('/apply/vacancy', controller.applyVacancy);
userRoutes.get('/connections', controller.userConnections);