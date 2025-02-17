import { Router } from "express";
import { UserController } from "./user.controller";
import { useAuth} from "../../middlewares/auth.middleware";

export const userRoutes = Router();
const controller = UserController();

userRoutes.put('/update',useAuth, controller.userEdit);
userRoutes.delete('/delete',useAuth, controller.userDelete);
userRoutes.post('/apply/vacancy',useAuth, controller.applyVacancy);
