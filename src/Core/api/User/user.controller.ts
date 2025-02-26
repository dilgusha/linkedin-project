import { NextFunction, Response } from "express";
import { validate } from "class-validator";
import { User } from "../../../DAL/models/User.model";
import { AuthRequest } from "../../../types";
import { EditUserDTO } from "./user.dto";
import { ConnectionStatus, ERoleType } from "../../app/enums";
import { Vacancy } from "../../../DAL/models/Vacancy.model";
import { formatErrors } from "../../middlewares/error.middleware";
import { Connection } from "../../../DAL/models/Connection.model";

const userEdit = async (
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
      res.status(422).json(formatErrors(errors));
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
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    user.softRemove();

    res.status(204).json({ message: "User uğurla silindi!" });
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
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const vacancy = await Vacancy.findOne({
      where: { id: vacancy_id },
      select: ["appliedUsers"],
    });

    if (!vacancy) {
      res.status(404).json({ message: "Seçilmiş vakansiya tapılmadı" });
      return;
    }

    const existingUser = await User.findOne({
      where: { id: user.id },
      relations: ["appliedVacancies"],
      select: ["name", "surname", "email", "companyName", "about", "id"],
    });

    if (!existingUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (existingUser.appliedVacancies.some((v) => v.id === vacancy.id)) {
      res
        .status(400)
        .json({ message: "Siz artıq bu vakansiyaya müraciət etmisiniz." });
      return;
    }

    existingUser.appliedVacancies.push(vacancy);
    await existingUser.save();

    res.status(201).json({ message: "Müraciət uğurla tamamlandı." });
  } catch (error) {
    console.error("Error applying to vacancy:", error);
    res.status(500).json({ message: "Server xətası baş verdi." });
  }
};

const userConnections = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const before_page = (page - 1) * limit;
    const [list, total] = await Connection.findAndCount({
      where: [
        { requester_id: user.id, status: ConnectionStatus.ACCEPTED }, // User request göndərib
        { receiver_id: user.id, status: ConnectionStatus.ACCEPTED }, // User request qəbul edib
      ],
      skip: before_page,
      take: limit,
      relations: ["requester", "receiver"],
      select: {
        id: true,
        status: true,
        created_at: true,
        requester: {
          id: true,
          name: true,
          surname: true,
          avatar_path: true,
        },
        receiver: {
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
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const UserController = () => ({
  userEdit,
  userDelete,
  applyVacancy,
  userConnections,
});
