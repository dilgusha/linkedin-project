import { Router } from "express";
import { PostController } from "./post.controller";
import { uploads } from "../../middlewares/multer.middleware";
import {  uploadImage } from "../uploads/upload.controller";

export const postRoutes = Router();
const controller = PostController();

postRoutes.post("/create", uploads.single("image"), controller.create);
//postRoutes.post("/create", uploads.single("image"), uploadImage, controller.create);
postRoutes.put("/update/:id", controller.editPost);
// postRoutes.post("/:id/like", useAuth, controller.toggleLike); // liked ? -> remove // not liked ? -> add
postRoutes.get("/:id/like", controller.likePost);
postRoutes.get("/:id/unlike", controller.unlikePost);
postRoutes.delete("/delete/:id", controller.deletePost);
postRoutes.get("/get/:id", controller.getById);
postRoutes.get("/list", controller.userPosts);