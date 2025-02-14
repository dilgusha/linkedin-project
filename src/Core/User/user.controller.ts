import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../../consts";
import { User } from "../../DAL/models/User.model";
import { AuthRequest } from "../../types";
import { CreateUserDTO, EditUserDTO } from "./user.dto";
import moment from "moment";
import { transporter } from "../../helpers";
import { v4 as uuidv4 } from "uuid";
import { ERoleType } from "../../DAL/enum/user.enum";
import { Vacancy } from "../../DAL/models/Vacancy.model";

const register = async (
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
      role,
      companyName,
      password,
      birthdate,
      profilePicture,
      phone,
      about,
      isVisibility,
    } = req.body;

    if (role === ERoleType.ADMIN) {
      res.json("Error");
      return;
    }

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
    dto.role = role;
    dto.companyName = companyName;
    dto.profilePicture = profilePicture;
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

    const newUser = User.create({
      name,
      surname,
      gender,
      email,
      role,
      password: newPassword,
      birthdate,
      profilePicture,
      phone,
      about,
      isVisibility,
    });

    if (role === ERoleType.COMPANY) {
      newUser.companyName = companyName;
    }

    await newUser.save();

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

const checkEmail = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.json("User not found;");
      return;
    }
    const email = user.email;

    if (user.isVerified === true) {
      res.json({ message: "Email is already verified" });
      return;
    }

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
        res.status(500).json({
          message: error.message,
          error,
        });
      } else {
        res.json({ message: "Check your email" });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const verifyEmail = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    const { code } = req.body;

    if (!user) {
      res.json("User not found;");
      return;
    }

    if (!user.verifyCode) {
      res.status(400).json({
        message: "Verification code not found!",
      });
      return;
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

    res.json({ message: "Email verified successfully!" });
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
      companyName
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
      companyName
    });

    if (user.role === ERoleType.COMPANY) {
      await User.update(id,
        { companyName,
      })
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

const ForgetPass = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  });

  if (!user) {
    res.status(401).json({
      message: "Belə bir istifadəçi yoxdur",
    });
    return;
  }

  const token = uuidv4();
  const resetExpiredIn = moment()
    .add(appConfig.VALIDITY_MINUTE_MAIL, "minutes")
    .toDate();

  user.uuidToken = token;
  user.resetExpiredIn = resetExpiredIn;

  await user.save();

  res.json("Check your email");

  const resetUrl = `${appConfig.CREATE_PASS_URL}${token}`;

  const mailOptions = {
    from: appConfig.EMAIL,
    to: req.body.email,
    subject: "Password Reset Request",
    html: `<h3>Password Reset</h3>
               <p>To reset your password, click the link below:</p>
               <a href="${resetUrl}">Reset Password</a>
               <p>This link is valid for ${appConfig.VALIDITY_MINUTE_MAIL} minute.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ message: "Error sending email", error });
      return;
    }
    res
      .status(200)
      .json({ message: "Password reset email sent successfully." });
  });
};

const CreatePass = async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword } = req.body;

  const user = await User.findOne({
    where: { uuidToken: req.params.uuidToken },
  });


  const dto = new CreateUserDTO();
  dto.password = newPassword;

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

  if (!user || !newPassword) {
    res.status(401).json({
      message: "Token və ya password yoxdur",
    });
    return;
  }

  if (user.resetExpiredIn.getTime() < Date.now()) {
    res.status(401).json({
      message: "Artıq vaxt bitib, yenidən cəhd edin!!!",
    });
    return;
  }

  const ValidPassword = await bcrypt.compare(newPassword, user.password);

  if (ValidPassword) {
    res.json("Əvvəlki parolu yaza bilməzsiniz");
    return;
  }

  const password = await bcrypt.hash(newPassword, 10);

  user.password = password;
  user.uuidToken = "";

  await user.save();
  res.send(`${user.email} mailinin password-ü yeniləndi`);
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
  register,
  login,
  userEdit,
  userDelete,
  ForgetPass,
  CreatePass,
  checkEmail,
  verifyEmail,
  applyVacancy,
});
