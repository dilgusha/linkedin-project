import { Router } from "express";
import { AuthController } from "./auth.controller"; 
import { useAuth } from "../../DAL/middlewares/auth.middleware";

export const authRoutes = Router();
const controller = AuthController();

authRoutes.post("/register", controller.register);
authRoutes.post('/login', controller.login);
authRoutes.get('/check/email',useAuth, controller.checkEmail);
authRoutes.post('/verify/email',useAuth, controller.verifyEmail);
authRoutes.get('/forget/password', controller.ForgetPass);
authRoutes.post('/create/password', controller.CreatePass);
