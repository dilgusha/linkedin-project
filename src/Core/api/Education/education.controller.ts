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

export const EducationController = () => ({
    create
});
