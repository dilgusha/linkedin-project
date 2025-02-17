import { Router } from "express";
import { userRoutes } from "../Core/api/User/user.route";
import { adminRoutes } from "../Core/api/Admin/admin.route";
import { vacancyRoutes } from "../Core/api/Vacancy/vacancy.route";
import { postRoutes } from "../Core/api/Post/post.route";
import { categoryRoutes } from "../Core/api/Category/category.route";
import { educationRoutes } from "../Core/api/Education/education.route";
import { experienceRoutes } from "../Core/api/Experience/experience.route";
import { commentRoutes } from "../Core/api/Comment/comment.route";
import { connectionRoutes } from "../Core/api/Connection/connection.route";
import { messageRoutes } from "../Core/api/Message/message.route";
import { notificationRoutes } from "../Core/api/Notification/notification.route";
import { authRoutes } from "../Core/api/Auth/auth.route";

export const v1Routes = Router();

v1Routes.use("/auth", authRoutes);
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