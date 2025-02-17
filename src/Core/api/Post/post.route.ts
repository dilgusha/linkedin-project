import { Router } from "express";
import { PostController } from "./post.controller";
import { useAuth } from "../../middlewares/auth.middleware";
import { uploads } from "../../middlewares/multer.middleware";

export const postRoutes = Router();
const controller = PostController();

postRoutes.post("/create", useAuth, uploads.single("image"), controller.create);
postRoutes.put("/update/:id", useAuth, controller.editPost);
// postRoutes.post("/:id/like", useAuth, controller.toggleLike); // liked ? -> remove // not liked ? -> add
postRoutes.get("/:id/like", useAuth, controller.likePost);
postRoutes.get("/:id/unlike", useAuth, controller.unlikePost);
postRoutes.delete("/delete/:id", useAuth, controller.deletePost);
