import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types";
import { VacancyCreateDto } from "./vacancy.dto";
import { validate } from "class-validator";
import { formatErrors } from "../../middlewares/error.middleware";
import { Vacancy } from "../../../DAL/models/Vacancy.model";
import fs from "fs";
import { User } from "../../../DAL/models/User.model";

const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { description } = req.body;

    const data = new VacancyCreateDto();
    data.description = description;

    const errors = await validate(data);
    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }

    const img = req.file;
    const newVacancy = Vacancy.create({
      description: description,
      image_url: img?.filename,
      user_id: user.id,
    });

    const savedVacancy = await newVacancy.save();

    res.status(201).json({
      id: savedVacancy.id,
      description: savedVacancy.description,
      image_url: savedVacancy.image_url,
    });
  } catch (error: any) {
    if (req.file) {
      const filePath = `uploads/${req.file.filename}`;

      fs.access(filePath, (err) => {
        if (err) {
          console.log("File does not exist", err);
          return;
        }
      });

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file", unlinkErr);
        } else {
          console.log("File deleted successfully");
        }
      });

      res.status(500).json({ message: "Internal server error", error });
    }
  }
};

const deletee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const vacancy = await Vacancy.findOne({ where: { id: Number(id) } });

    if (!vacancy) {
      res.status(404).json({ message: "Vacancy not found" });
      return;
    }
    await Vacancy.remove(vacancy);

    res.status(204).json("Vacancy deleted successfully");
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getByUser = async (
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
    const vacancies = await Vacancy.find({
      where: { user_id: user.id },
      relations: ["appliedUsers"],
    });
    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
const getAppliedVacancies = async (req: AuthRequest, res:Response, next: NextFunction) => {
  const user = req.user
  if (!user) {
    res.status(401).json("user tapilmadi")
    return
  }
  try {
    const users = await User.find({
      where: { id: user.id },
      relations: ["appliedVacancies"],
      select: ["name", "id", "surname","email"]
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}
export const VacancyController = () => ({
  create,
  deletee,
  getByUser,
  getAppliedVacancies
});
