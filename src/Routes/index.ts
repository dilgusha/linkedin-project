import { Router } from "express";
import { userRoutes } from "../Core/User/user.route";
import { adminRoutes } from "../Core/Admin/admin.route";
import { vacancyRoutes } from "../Core/Vacancy/vacancy.route";
import { postRoutes } from "../Core/Post/post.route";
import { categoryRoutes } from "../Core/Category/category.route";
import { educationRoutes } from "../Core/Education/education.route";
import { experienceRoutes } from "../Core/Experience/experience.route";
import { commentRoutes } from "../Core/Comment/comment.route";
import { connectionRoutes } from "../Core/Connection/connection.route";
import { messageRoutes } from "../Core/Message/message.route";
import { notificationRoutes } from "../Core/Notification/notification.route";

export const v1Routes = Router();

v1Routes.use("/admin", adminRoutes);
v1Routes.use("/user", userRoutes);
v1Routes.use("/vacancy", vacancyRoutes);
v1Routes.use("/post", postRoutes);
v1Routes.use("/category", categoryRoutes);
v1Routes.use("/education", educationRoutes);
v1Routes.use("/experience", experienceRoutes);
v1Routes.use("/comment", commentRoutes);
v1Routes.use("/connection", connectionRoutes);
v1Routes.use("/message", messageRoutes);
v1Routes.use("/notification", notificationRoutes);