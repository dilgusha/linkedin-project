import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { appConfig } from "../../../consts";
import { User } from "../../../DAL/models/User.model";
import { validate } from "class-validator";
import { transporter } from "../../../helpers";
import { CreateUserByAdminDTO, EditUserByAdminDTO } from "./admin.dto";
import { In } from "typeorm";
import { ERoleType } from "../../app/enums"; 
import { formatErrors } from "../../middlewares/error.middleware";
import { Package } from "../../../DAL/models/Package.model";

const userCreate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
        name,
        surname,
        gender,
        email,
        role,
        companyName,
        password,
        birthdate,
        phone,
        about,
        isVisibility,
      } = req.body;

    if (role && !(role in ERoleType)) {
      const error = new Error(`Invalid role! Allowed roles: ${ERoleType}`);
      throw error;
    }

    const user = await User.findOne({ where: { email: email } });

    if (user) {
      res.status(409).json("Bu emaile uygun user artiq movcuddur");
      return;
    }

    const newPassword = await bcrypt.hash(password, 10);

    const dto = new CreateUserByAdminDTO();
    dto.name = name;
    dto.surname = surname;
    dto.gender = gender;
    dto.email = email;
    dto.password = password;
    dto.birthdate = birthdate;
    dto.role = role;
    dto.companyName = companyName;
    dto.phone = phone;
    dto.about = about;
    dto.isVisibility = isVisibility;

    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return
    }

    const newUser = User.create({
        name,
        surname,
        gender,
        email,
        role,
        password: newPassword,
        birthdate,
        phone,
        about,
        isVisibility,
      });

    await newUser.save();

    if (role === ERoleType.COMPANY) {
        newUser.companyName = companyName;
      }

      const data = await User.findOne({
        where: { email },
        select: [
          "id",
          "name",
          "surname",
          "email",
          "role",
          "created_at",
        ],
      });

    const mailOptions = {
      from: appConfig.EMAIL,
      to: email,
      subject: "Hello",
      html: `<h3>Created User</h3>
            <p>You have been created as a user</p>
            <p>You can see the changes below:</p>
            <ul>
              <li><strong>Name:</strong> ${newUser.name}</li>
              <li><strong>Surname:</strong> ${newUser.surname}</li>
              <li><strong>Email:</strong> ${newUser.email}</li>
              <li><strong>Role:</strong> ${newUser.role}</li>
            </ul>`,
    };


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json("Error sending email");
        return;
      } else {
        console.log("Email sent: ", info);
        res.status(201).json({ data });
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const userEdit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const id = Number(req.params.id);

    const user = await User.findOne({
      where: { id },
      select: [
        "id",
        "name",
        "surname",
        "email",
        "role",
        "created_at",
      ],
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (role && !(role in ERoleType)) {
      const error = new Error(`Invalid role! Allowed roles: ${ERoleType}`);
      throw error;
    }

    if ( !role) {
      res.status(304).json("Hech bir deyishiklik yoxdur");
      return;
    }

    if (
      user.role === (role || undefined)
    ) {
      res.status(304).json("Hech bir deyishiklik yoxdur");
      return;
    }

    const dto = new EditUserByAdminDTO();
    dto.role = role;

    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }
    await User.update(id, {
      role,
    });

    const updatedData = await User.findOne({
      where: { id },
      select: [
        "id",
        "name",
        "surname",
        "email",
        "role",
        "created_at",
        "updated_at",
      ],
    });

    const mailOptions = {
      from: appConfig.EMAIL,
      to: user.email,
      subject: "Your Profile Has Been Updated",
      html: `<h3>Your Profile Updates</h3>
             <p>The following changes were made to your profile:</p>
             <ul>
             </ul>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
       res.status(500).json({
          message: error.message,
          error,
        });
      } else {
        console.log("Email sent: ", info);
       res.json({ message: "Check your email" });
      }
    });

   // res.status(201).json({ updatedData });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const userDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleteUser = await User.findOne({
      where: { id: Number(req.params.id) },
    });

    if (!deleteUser) {
      res.status(401).json({ message: "Unauthorized" });
         return;
    }

    await User.softRemove(deleteUser);

    res.status(204).json({ message: "User uğurla silindi!" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const adminList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const before_page = (page - 1) * limit;
    const [list, total] = await User.findAndCount({
      where:{ role: ERoleType.ADMIN },
      skip: before_page,
      take: limit,
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

const userList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const before_page = (page - 1) * limit;
    const [ list, total] = await User.findAndCount({
      where: { role: In([ERoleType.COMPANY, ERoleType.USER]) },
      skip: before_page,
      take: limit,
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

const RoleList = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(ERoleType);
};

const createPremiumPackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, monthly_price, annual_price } = req.body;

    const newData = await Package.create({
      name,
      monthly_price,
      annual_price
    }).save()

    res.json({
      data: newData
    })

  } catch (error) {

  }
}

export const AdminController = () => ({
  userCreate,
  userEdit,
  userDelete,
  adminList,
  userList,
  RoleList,
  createPremiumPackage
});
