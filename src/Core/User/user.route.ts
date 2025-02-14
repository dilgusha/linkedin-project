import { Router } from "express";
import { UserController } from "./user.controller";
import { useAuth, roleCheck } from "../../DAL/middlewares/auth.middleware";
import { ERoleType } from "../../DAL/enum/user.enum"; 

export const userRoutes = Router();
const controller = UserController();

userRoutes.post("/register", controller.register);
userRoutes.post('/login', controller.login);
userRoutes.post('check/email',useAuth, controller.checkEmail);
userRoutes.post('verify/email',useAuth, controller.verifyEmail);
userRoutes.put('update',useAuth, controller.userEdit);
userRoutes.delete('delete',useAuth, controller.userDelete);
userRoutes.post('forget/password', controller.ForgetPass);
userRoutes.post('create/password', controller.CreatePass);
userRoutes.delete('apply/vacancy',useAuth, controller.applyVacancy);
