import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types";
import { CreateExperienceDTO } from "./experience.dto";
import { validate } from "class-validator";
import { formatErrors } from "../../middlewares/error.middleware";
import { Experience } from "../../../DAL/models/Experience.model";

const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      res.json("User not found");
      return;
    }

    const { category, company, location, startDate, endDate, description } =
      req.body;

    const dto = new CreateExperienceDTO();
    dto.category = category;
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
        category,
        company,
        location,
        startDate,
        endDate,
        description,
        user_id: user.id
    });

    res.status(201).json(newExperience);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the experience",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const ExperinceController = () => ({
    create
});
