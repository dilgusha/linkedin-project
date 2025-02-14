import { Router } from "express";
import { PostController } from "./post.controller";

export const postRoutes = Router();
const controller = PostController();