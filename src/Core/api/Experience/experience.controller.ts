import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types";
import { CreateExperienceDTO } from "./experience.dto";
import { validate } from "class-validator";
import { formatErrors } from "../../middlewares/error.middleware";
import { Experience } from "../../../DAL/models/Experience.model";
import { In } from "typeorm";
import { Category } from "../../../DAL/models/Category.model";

const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
         return;
    }

    const { category_ids, company, location, startDate, endDate, description } =
      req.body;

    const category_list = await Category.find({
      where: {
        id: In(category_ids),
      },
    });

    if (category_list.length === 0) {
      res.status(404).json("Kateqoriya yoxdur");
      return;
    }

    const dto = new CreateExperienceDTO();
    dto.categories = category_list;
    dto.company = company;
    dto.location = location;
    dto.startDate = startDate;
    dto.endDate = endDate;
    dto.description = description;

    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }

    const newExperience = Experience.create({
      categories: category_list,
      company,
      location,
      startDate,
      endDate,
      description,
      user_id: user.id,
    });

    await newExperience.save();

    res.status(201).json(newExperience);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the experience",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const getUserExperience = async (
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

    const experience = await Experience.findOne({
      where: { user_id: user.id },
    });

    if (!experience) {
      res.status(404).json({ message: "Experience not found" });
      return;
    }

    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching the experience",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      id,
      category_ids,
      company,
      location,
      startDate,
      endDate,
      description,
    } = req.body;

    if (!id) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const experience = await Experience.findOne({
      where: { id: +id, user_id: user.id },
    });

    if (!experience) {
      res.status(404).json({ message: "Experience not found" });
      return;
    }

    const category_list = category_ids
      ? await Category.find({ where: { id: In(category_ids) } })
      : [];

    if (category_ids && category_list.length === 0) {
      res.status(400).json({ message: "Invalid categories" });
      return;
    }

    const parsedStartDate = startDate
      ? new Date(startDate)
      : experience.startDate;
    const parsedEndDate = endDate ? new Date(endDate) : experience.endDate;

    Object.assign(experience, {
      company: company || experience.company,
      location: location || experience.location,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      description: description || experience.description,
      categories:
        category_list.length > 0 ? category_list : experience.categories,
    });

    const dto = new CreateExperienceDTO();
    dto.categories = category_list;
    dto.company = experience.company;
    dto.location = experience.location;
    dto.startDate = parsedStartDate;
    dto.endDate = parsedEndDate;
    dto.description = experience.description;

    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }

    await experience.save();
    res.status(200).json({
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const deleteExperience = async(req:AuthRequest,res:Response,next:NextFunction)=>{
  try{
    const user=req.user
    if(!user){
      res.status(404).json ("user not found")
      return
    }

  const experience_id =Number(req.params)
  if(!experience_id){
    res.status(400).json("id is required")
  }
  const experience =await Experience.findOne({
    where:{id:experience_id},
    relations:["user"]//?
  })
  if(!experience){
    res.status(404).json({message:"experience not found"})
    return
  }
  if(experience.user_id !== user.id){
    res.status(403).json("You cannot this operation")
    return
  }
  await Experience.softRemove(experience)
  res.status(204).json({message:"experience deleted succesfully"})
}catch(error){
  res.status(500).json({
    message:"Internal server error",
    error,
  })
}
}

export const ExperinceController = () => ({
  create,
  getUserExperience,
  update,
  deleteExperience,
});
