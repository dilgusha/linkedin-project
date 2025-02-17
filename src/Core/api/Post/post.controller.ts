import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types";
import { PostCreateDto, PostUpdateDto } from "./post.dto";
import { validate } from "class-validator";
import { formatErrors } from "../../middlewares/error.middleware";
import { Post } from "../../../DAL/models/Post.model";
import fs from "fs";

const create = async (req: AuthRequest, res: Response) => {
  try {
    // console.log("req.user", req.user);

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { content } = req.body;

    const dto = new PostCreateDto();
    dto.content = req.body.content;

    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }

    // const images = req.files as Record<string, Express.Multer.File[]>;
    const image = req.file;
    console.log(image, "sad");

    const newData = new Post();
    newData.content = dto.content;
    // newData.imagesPath = images["images"]?.map((image) => image.filename) || [];
    newData.imagesPath = image?.filename;
    newData.user_id = req.user.id;

    await Post.save(newData);

    throw new Error(" custom Error");

    res.status(201).json({
      id: newData.id,
      message: "Post created successfully",
    });
  } catch (error: any) {
    console.log(error.message);

    // vakansiya CREATE / Delete
    // user experience (ish yerleri) CRUD
    // user education (təhsil) CRUD

    // if (req.file) {
    //   console.log("file var", req.file.filename);
    //   let isExist = false;
    //   fs.access(`uploads/${req.file.filename}`, (err) => {
    //     if (err) {
    //       console.log(err, "er");
    //       isExist = false;
    //       return;
    //     }

    //     console.log("file exists");
    //     isExist = true;
    //   });
    //   console.log(isExist, "isExist");

    if (req.file) {
      fs.unlink(`uploads/${req.file.filename}`, (err) => {
        if (err) {
          console.log(err, "err");
        }
        console.log("file deleted");
      });
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
      res.json("User not found");
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
      res.status(400).json(formatErrors(errors));
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
      res.json("Siz bu posta duzelish ede bilmezsiz");
      return;
    }

    const update = content !== post.content;

    if (!update) {
      res.json({
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
      res.json("User not found!");
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
      res.json("Siz bu postu sile bilmezsiz");
      return;
    }

    await Post.softRemove(post);

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json("An error occurred while deleting the post.");
  }
};

export const PostController = () => ({
  create,
  editPost,
  likePost,
  unlikePost,
  deletePost,
});
