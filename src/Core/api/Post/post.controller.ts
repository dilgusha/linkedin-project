import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types";
import { PostCreateDto, PostUpdateDto } from "./post.dto";
import { validate } from "class-validator";
import { formatErrors } from "../../middlewares/error.middleware";
import { Post } from "../../../DAL/models/Post.model";
import fs, { unlink } from "fs/promises";
import path from "path";
import { ImageModel } from "../../../DAL/models/Image.model";

const create = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { content } = req.body;
    const image = req.file;

    const dto = new PostCreateDto();
    dto.content = content;

    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }

    const newData = new Post();
    newData.content = dto.content;
    newData.imagePath = image?.filename;
    newData.user_id = user.id;

    await Post.save(newData);

    res.status(201).json({
      id: newData.id,
      message: "Post created successfully",
    });
  } catch (error: any) {

    if (req.file) {
      console.log("file var", req.file.filename);
      const filePath = `uploads/${req.file.filename}`;

      try {
        await fs.access(filePath);
        console.log("file exists");

        await fs.unlink(filePath);
        console.log("file deleted");
      } catch (err) {
        console.log("Fayl mövcud deyil və ya silinərkən xəta baş verdi:", err);
      }
    }
    res.status(500).json({ message: "Internal server error" });
  }
};


const editPost = async (
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

    const post_id = Number(req.params.id);

    if (!post_id) {
      new Error("Id is required");
      return;
    }

    const { content } = req.body;

    const dto = new PostUpdateDto();
    dto.content = content;

    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }

    const post = await Post.findOne({
      where: { id: post_id },
      relations: ["user"],
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.user_id !== user.id) {
      res.status(403).json("Siz bu posta duzelish ede bilmezsiz");
      return;
    }

    const update = content !== post.content;

    if (!update) {
      res.status(304).json({
        message: "No changes detected, coment not updated.",
      });
      return;
    }

    await Post.update(post_id, {
      content,
    });

    const updatedData = await Post.findOne({
      where: { id: post_id },
      relations: ["user"],
      select: ["id", "content", "updated_at"],
    });

    res.json({
      message: "Post updated successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while update the post",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const likePost = async (
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

    const post = await Post.findOne({
      where: { id: post_id },
      relations: ["likedUsers"],
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // check if user already liked the post
    const isLiked = post.likedUsers.some((user) => user.id === req.user?.id);
    if (isLiked) {
      // res.sendStatus(200);
      res.status(400).json({ message: "Post already liked" });
      return;
    }

    post.likedUsers.push(req.user);

    await post.save().then(() => {
      res.status(200).json({ message: "Post liked successfully" });
    });
  } catch (error) {
    next("An error occurred on like post");
  }
};

const unlikePost = async (
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

    const post = await Post.findOne({
      where: { id: post_id },
      relations: ["likedUsers"],
    });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // check if user already liked the post
    const isLiked = post.likedUsers.some((user) => user.id === req.user?.id);
    if (!isLiked) {
      res.status(400).json({ message: "Post not liked" });
      return;
    }

    post.likedUsers = post.likedUsers.filter(
      (user) => user.id !== req.user?.id
    );

    await post.save().then(() => {
      res.status(200).json({ message: "Post unlike successfully" });
    });
  } catch (error) {
    next("An error occurred on like post");
  }
};

const deletePost = async (
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

    const post_id = Number(req.params.id);
    if (!post_id) {
      new Error("Id is required");
      return;
    }

    const post = await Post.findOne({
      where: { id: post_id },
      relations: ["user"],
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.user_id !== user.id) {
      res.status(403).json("Siz bu postu sile bilmezsiz");
      return;
    }

    await Post.softRemove(post);

    res.status(204).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json("An error occurred while deleting the post.");
  }
};

const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const post_id = Number(req.params.id);

    if (!post_id) {
      res.status(400).json("Id is required");
      return;
    }

    const post = await Post.findOne({
      where: { id: post_id },
      relations: ["user", "likedUsers"],
      select: {
        id: true,
        content: true,
        //image?:true,
        created_at: true,
        user: {
          id: true,
          name: true,
          surname: true,
          avatar_path: true,
        },
        likedUsers: {
          id: true,
          name: true,
          surname: true,
          avatar_path: true,
        },
      },
    });

    if (!post) {
      res.status(404).json("Post is not found");
      return;
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const userPosts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const before_page = (page - 1) * limit;
    const [list, total] = await Post.findAndCount({
      where: { user_id: user.id },
      skip: before_page,
      take: limit,
      relations: ["likedUsers"],
      select: {
        id: true,
        content: true,
        created_at: true,
        likedUsers: {
          id: true,
          name: true,
          surname: true,
          avatar_path: true,
        },
      },
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
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const PostController = () => ({
  create,
  editPost,
  likePost,
  unlikePost,
  deletePost,
  getById,
  userPosts,
});
