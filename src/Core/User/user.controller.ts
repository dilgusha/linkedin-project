import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../../consts";
import { ERoleType, User } from "../../DAL/models/User.model";
import { In } from "typeorm";
import { AuthRequest } from "../../types";
import { CreateUserDTO, EditUserDTO, verifyUserDTO } from "./user.dto";
import moment from "moment";
import { transporter } from "../../helpers";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      surname,
      gender,
      email,
      password,
      birthdate,
      profilePicture,
      phone,
      about,
      isVisibility,
    } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (user) {
      res.json("Bu emaile uygun user artiq movcuddur");
      return;
    }

    const newPassword = await bcrypt.hash(password, 10);

    const dto = new CreateUserDTO();
    dto.name = name;
    dto.surname = surname;
    dto.gender = gender;
    dto.email = email;
    dto.password = newPassword;
    dto.birthdate = birthdate;
    dto.profilePicture = profilePicture;
    dto.phone = phone;
    dto.about = about;
    dto.isVisibility = isVisibility;

    const errors = await validate(dto);

    if (errors.length > 0) {
      next(errors);
      return;
    }

    const newUser = User.create({
      name,
      surname,
      gender,
      email,
      password: newPassword,
      birthdate,
      profilePicture,
      phone,
      about,
      isVisibility,
    });
    const savedUser = await newUser.save();

    const Data = await User.findOne({
      where: { email },
      select: ["id", "name", "surname", "email", "created_at"],
    });

    res.status(201).json(Data);
    next();
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email: email },
  });
  if (!user) {
    res.status(401).json({ message: "Email ve ya shifre sehvdir!" });
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    res.status(401).json({
      message: "Email ve ya shifre sehvdir!",
    });
    return;
  }

  const jwt_payload = {
    sub: user.id,
  };
  const jwtSecret = String(appConfig.JWT_SECRET);

  const new_token = jwt.sign(jwt_payload, jwtSecret, {
    algorithm: "HS256",
    expiresIn: "1d",
  });

  res.json({
    access_token: new_token,
  });
};

const verifyEmail = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.json("User not found;");
      return;
    }
    const email = user.email;

    if (user.isVerified === true)
      return res.json({ message: "Email is already verified" });

    const verifyCode = Math.floor(100000 + Math.random() * 600000);

    const verifyExpiredIn = moment()
      .add(appConfig.VALIDITY_MINUTE_MAIL, "minutes")
      .toDate();

    await User.update(email, {
      verifyCode,
      verifyExpiredIn,
    });

    const mailOptions = {
      from: appConfig.EMAIL,
      to: email,
      subject: "Hello",
      text: `Please Verify your Email address ${verifyCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return res.status(500).json({
          message: error.message,
          error,
        });
      } else {
        return res.json({ message: "Check your email" });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const checkVerifyCode = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const { code } = req.body;

    if (!user) {
      res.json("User not found;");
      return;
    }

    if (!user.verifyCode) {
      return res.status(400).json({
        message: "Verification code not found!",
      });
    }

    if (user.verifyExpiredIn.getTime() < Date.now()) {
      res.status(400).json("artıq vaxt bitib, yenidən cəhd edin");
      return;
    }

    if (user.verifyCode !== code) {
      res.status(400).json("kod eyni deyil");
      return;
    }

    await User.update(user.id, {
      isVerified: true,
      verifyCode: undefined,
      verifyExpiredIn: undefined,
    });

    return res.json({
      message: "Email verified successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

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

    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.reduce((response: any, item: any) => {
          response[item.property] = Object.keys(item.constraints);
          return response;
        }, {}),
      });
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
    });

    const updatedData = await User.findOne({
      where: { id },
      select: [
        "id",
        "name",
        "surname",
        "email",
        "updated_at",
      ],
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

const userDelete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
const user = req.user;
  
      if (!user) {
        res.json("Bele bir user yoxdur");
        return;
      }
  
      //await User.softRemove(user);
  
      res.json({ message: "User uğurla silindi!" });

} catch (error) {
  console.error('Error removing user:', error);
  res.status(500).json('An error occurred while removing the user.');
    }
  };

export const UserController = () => ({
  registerUser,
  login,
  userEdit,
  verifyEmail,
  checkVerifyCode,
});
