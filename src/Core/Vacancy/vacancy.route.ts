import { Router } from "express";
import { VacancyController } from "./vacancy.controller"; 

export const vacancyRoutes = Router();
const controller = VacancyController();