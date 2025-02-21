import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types";
import { validate } from "class-validator";
import { formatErrors } from "../../middlewares/error.middleware";
import { Experience } from "../../../DAL/models/Experience.model";
import { CreateEducationDTO, EditEducationDTO } from "./education.dto";
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
    res.status(500).json({
      message: "An error occurred while create the education",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const editEducation = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.json("User not found");
      return;
    }

    const education_id = Number(req.params.id);

    if (!education_id) {
      new Error("Id is required");
      return;
    }
    const { schoolName, degree, faculty, startDate, endDate } = req.body;

    const image = req.file;

    const dto = new EditEducationDTO();
    dto.schoolName = schoolName;
    dto.degree = degree;
    dto.faculty = faculty;
    dto.startDate = startDate;
    dto.endDate = endDate;

    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(400).json(formatErrors(errors));
      return;
    }

    const education = await Education.findOne({
      where: { id: education_id },
      relations: ["user"],
    });

    if (!education) {
      res.status(404).json({ message: "Education not found" });
      return;
    }

    if (education.user_id !== user.id) {
      res.json("Siz bu educationa duzelish ede bilmezsiz");
      return;
    }

    await Education.update(education_id, {
      schoolName,
      degree,
      faculty,
      imageUrl: image?.filename,
      startDate,
      endDate
    });

    const updatedData = await Education.findOne({
      where: { id: education_id },
      relations: ["user"],
      select: ["id", "schoolName", "degree", "faculty", "updated_at"],
    });

    res.json({
      message: "Education updated successfully",
      data: updatedData,
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
    res.status(500).json({
      message: "An error occurred while update the education",
      error: error instanceof Error ? error.message : error,
    });
  }
};
const getUserEducation = async(req:AuthRequest,res:Response,next:NextFunction)=>{
  try{
    const user = req.user
    if(!user){
      res.json("User not found")
      return
    }
    const getEducation =await Education.findOne({
      where:{user_id:user.id}
    })
    if(!getEducation){
      res.json("Education not found")
      return
    }
    res.status(200).json(getEducation)
}catch(error){
  res.status(500).json({
    message:"Internal server error",
    error,
  })
}
}
const deleteEducation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const  educationId  = Number(req.params.id);

    if (!user) {
      res.json("User not found");
      return;
    }

    const education = await Education.findOne({
      where: { id: educationId, user_id: user.id },
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
  editEducation,
  deleteEducation,
  getUserEducation,
});
