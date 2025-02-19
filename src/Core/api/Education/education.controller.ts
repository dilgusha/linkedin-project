import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types";
import { validate } from "class-validator";
import { formatErrors } from "../../middlewares/error.middleware";
import { Experience } from "../../../DAL/models/Experience.model";
import { CreateEducationDTO } from "./education.dto";
import { Education } from "../../../DAL/models/Education.model";
import fs from "fs/promises";

const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      res.json("User not found");
      return;
    }

    const { schoolName, degree, faculty, startDate, endDate } = req.body;

    const image = req.file;

    const dto = new CreateEducationDTO();
    dto.schoolName = schoolName;
    dto.degree = degree;
    dto.faculty = faculty;
    dto.startDate = startDate;
    dto.endDate = endDate;

    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }

    const newEducation = Education.create({
      schoolName,
      degree,
      faculty,
      startDate,
      endDate,
      imageUrl: image?.filename,
      user_id: user.id,
    });

    await newEducation.save();

    res.status(201).json(newEducation);
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

// const editEducation = async (req: AuthRequest, res: Response) => {
//   try {
//     const user = req.user;

//     if (!user) {
//       res.json("User not found");
//       return;
//     }

//     const education_id = Number(req.params.id);

//     if (!education_id) {
//       new Error("Id is required");
//       return;
//     }

//     const { content } = req.body;

//     const dto = new PostUpdateDto();
//     dto.content = content;

//     const errors = await validate(dto);

//     if (errors.length > 0) {
//       res.status(400).json(formatErrors(errors));
//       return;
//     }

//     const post = await Post.findOne({
//       where: { id: post_id },
//       relations: ["user"],
//     });

//     if (!post) {
//       res.status(404).json({ message: "Post not found" });
//       return;
//     }

//     if (post.user_id !== user.id) {
//       res.json("Siz bu posta duzelish ede bilmezsiz");
//       return;
//     }

//     const update = content !== post.content;

//     if (!update) {
//       res.json({
//         message: "No changes detected, coment not updated.",
//       });
//       return;
//     }

//     await Post.update(post_id, {
//       content,
//     });

//     const updatedData = await Post.findOne({
//       where: { id: post_id },
//       relations: ["user"],
//       select: ["id", "content", "updated_at"],
//     });

//     res.json({
//       message: "Post updated successfully",
//       data: updatedData,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "An error occurred while update the post",
//       error: error instanceof Error ? error.message : error,
//     });
//   }
// };

const deleteEducation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { educationId } = req.params;

    if (!user) {
      res.json("User not found");
      return;
    }

    const education = await Education.findOne({
      where: { id: Number(educationId), user_id: user.id },
    });

    if (!education) {
      res.status(404).json({ message: "Education record not found" });
      return;
    }

    if (education.imageUrl) {
      const filePath = `uploads/${education.imageUrl}`;

      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log("Image deleted:", filePath);
      } catch (err) {
        console.log("File not found or error deleting file:", err);
      }
    }

    await education.remove();

    res.status(200).json({ message: "Education record deleted successfully" });
  } catch (error) {
    console.log("Error deleting education record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const EducationController = () => ({
  create,
  deleteEducation,
});
