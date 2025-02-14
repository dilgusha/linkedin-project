import { Router } from "express";
import { CommentController } from "./comment.controller";

export const commentRoutes = Router();
const controller = CommentController();