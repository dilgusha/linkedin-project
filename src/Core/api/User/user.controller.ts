import { NextFunction, Response } from "express";
import { validate } from "class-validator";
import { User } from "../../../DAL/models/User.model";
import { AuthRequest } from "../../../types";
import { EditUserDTO } from "./user.dto";
import { ERoleType } from "../../app/enums";
import { Vacancy } from "../../../DAL/models/Vacancy.model";
import { formatErrors } from "../../middlewares/error.middleware";

const userEdit = async (
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

    const id = user.id;

    const {
      name,
      surname,
      gender,
      email,
      password,
      birthdate,
      phone,
      about,
      isVisibility,
      companyName,
    } = req.body;

    const dto = new EditUserDTO();
    dto.name = name;
    dto.surname = surname;
    dto.gender = gender;
    dto.email = email;
    dto.password = password;
    dto.birthdate = birthdate;
    dto.phone = phone;
    dto.about = about;
    dto.isVisibility = isVisibility;
    dto.companyName = companyName;

    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(400).json(formatErrors(errors));
      return;
    }

    await User.update(id, {
      name,
      surname,
      gender,
      email,
      password,
      birthdate,
      phone,
      about,
      isVisibility,
      companyName,
    });

    if (user.role === ERoleType.COMPANY) {
      await User.update(id, { companyName });
    }

    const updatedData = await User.findOne({
      where: { id },
      select: ["id", "name", "surname", "email", "updated_at"],
    });

    res.json({
      message: "User updated successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while update the book",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const userDelete = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.json("Bele bir user yoxdur");
      return;
    }

    user.softRemove();

    res.json({ message: "User uğurla silindi!" });
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json("An error occurred while removing the user.");
  }
};

const applyVacancy = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { vacancy_id } = req.body;

    if (!user) {
      res.json("User not found!");
      return;
    }

    const vacancy = await Vacancy.findOne({
      where: { id: vacancy_id },
    });

    if (!vacancy) {
      res.json({ message: "Seçilmiş vakansiya tapılmadı" });
      return;
    }

    const existingUser = await User.findOne({
      where: { id: user.id },
      relations: ["appliedVacancies"],
    });

    if (!existingUser) {
      res.json({ message: "User tapılmadı" });
      return;
    }

    if (user.appliedVacancies.some((v) => v.id === vacancy.id)) {
      res
        .status(400)
        .json({ message: "Siz artıq bu vakansiyaya müraciət etmisiniz." });
      return;
    }

    user.appliedVacancies.push(vacancy);
    await User.save(user);

    res.status(201).json({ message: "Müraciət uğurla tamamlandı." });
  } catch (error) {
    console.error("Error applying to vacancy:", error);
    res.status(500).json({ message: "Server xətası baş verdi." });
  }
};

export const UserController = () => ({
  userEdit,
  userDelete,
  applyVacancy,
});
