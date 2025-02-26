import { Router } from "express";
import { AdminController } from "./admin.controller"; 

export const adminRoutes = Router();
const controller = AdminController();

adminRoutes.post("/create", controller.userCreate);
adminRoutes.put('/update/:id', controller.userEdit)
adminRoutes.delete('/delete/:id', controller.userDelete)
adminRoutes.get('/list', controller.adminList)
adminRoutes.get('/users/list', controller.userList)
adminRoutes.get('/role/list', controller.RoleList)
adminRoutes.post('/package/create', controller.createPremiumPackage)
adminRoutes.put('/package/update/:id', controller.updatePremiumPackage)
adminRoutes.delete('/package/delete/:id', controller.deletePremiumPackage)