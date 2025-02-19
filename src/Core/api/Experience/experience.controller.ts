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
      res.json("User not found");
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
        res.json("Kateqoriya yoxdur");
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
        categories:category_list,
        company,
        location,
        startDate,
        endDate,
        description,
        user_id: user.id,
      });
  
      res.status(201).json(newExperience);
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while creating the experience",
        error: error instanceof Error ? error.message : error,
      });
    }
  };    

const getAllExperience = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const experience = await Experience.findOne({ where: { user_id: user.id } });

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

export const ExperinceController = () => ({
    create,
    getAllExperience
});
