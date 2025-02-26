import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types";
import { validate } from "class-validator";
import { formatErrors } from "../../middlewares/error.middleware";
import { Post } from "../../../DAL/models/Post.model";
import { Comment } from "../../../DAL/models/Comment.model";
import { CommentCreateDto } from "./comment.dto";

const addComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const post_id = Number(req.params.id);
    if (!post_id) {
      res.status(400).json({ message: "Invalid post id" });
      return;
    }

    const dto = new CommentCreateDto();
    dto.content = req.body.content;

    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }

    const post = await Post.findOne({
      where: { id: post_id },
      relations: ["comments"],
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const newComment = new Comment();
    newComment.content = dto.content;
    newComment.user_id = req.user.id;
    newComment.post = post;

    await newComment.save().then(() => {
      res.status(201).json({
        id: newComment.id,
        post_id: post.id,
        message: "Comment added successfully",
      });
    });
  } catch (error) {
    next("An error occurred on add comment");
  }
};

const editComment = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
         return;
    }

    const comment_id = Number(req.params.id);

    if (!comment_id) {
      new Error("Id is required");
      return;
    }

    const { content } = req.body;

    const dto = new CommentCreateDto();
    dto.content = content;

    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }

    const comment = await Comment.findOne({
      where: { id: comment_id, user_id: user.id },
      relations: ["user"],
    });

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if(comment.content === content){
      res.status(304).json("Hech bir deyishiklik yoxdur")
      return
    }

    await Comment.update(comment_id, {
      content,
    });

    const updatedData = await Comment.findOne({
      where: { id: comment_id },
      select: ["id", "content", "updated_at"],
    });

    res.json({
      message: "Comment updated successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const commentList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const post_id =Number(req.params.id)
    if(!post_id){
      res.status(400).json("Id is required")
      return
    }

    const post = await Post.findOne({
      where:{id: post_id}
    });

    if(!post){
      res.status(404).json("Post not found")
      return
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const before_page = (page - 1) * limit;
    const [ list, total] = await Comment.findAndCount({
      where:{post_id:post_id},
      skip: before_page,
      take: limit,
    });

    res.status(200).json({
      data: list,
      pagination: {
        total,
        page,
        items_on_page: list.length,
        per_page: Math.ceil(Number(total) / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const deleteComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
         return;
    }

    const comment_id = Number(req.params.id);

    if (!comment_id) {
      new Error("Id is required");
      return;
    }

    const comment = await Comment.findOne({
      where: { id: comment_id },
      relations: ["user", "post"],
    });

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const isPostOwner = await Post.findOne({
      where: { id: comment.post_id, user: { id: user.id } },
    });

    const isCommentOwner = comment.user_id === user.id;

    if (!isCommentOwner && !isPostOwner) {
      res.status(403).json("Siz bu commenti sile bilmezsiz");
      return;
    }

    await Comment.softRemove(comment);

    res.status(204).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json("An error occurred while deleting the post.");
  }
};

export const CommentController = () => ({
  addComment,
  editComment,
  commentList,
  deleteComment,
});
