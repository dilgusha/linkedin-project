import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../../../consts";
import { User } from "../../../DAL/models/User.model";
import { AuthRequest } from "../../../types";
import moment from "moment";
import { transporter } from "../../../helpers";
import { v4 as uuidv4 } from "uuid";
import { ERoleType } from "../../app/enums";
import { formatErrors } from "../../middlewares/error.middleware";
import { CreatePassDTO, CreateUserDTO } from "./auth.dto";

const register = async (req: Request, res: Response, next: NextFunction) => {
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
      avatar_path,
      phone,
      about,
      isVisibility,
    } = req.body;

    if (role === ERoleType.ADMIN) {
      res.status(403).json("Error");
      return;
    }

    const user = await User.findOne({ where: { email: email } });
    if (user) {
      res.status(409).json("Bu emaile uygun user artiq movcuddur");
      return;
    }

    const newPassword = await bcrypt.hash(password, 10);

    const dto = new CreateUserDTO();
    dto.name = name;
    dto.surname = surname;
    dto.gender = gender;
    dto.email = email;
    dto.password = password;
    dto.birthdate = birthdate;
    dto.role = role;
    dto.companyName = companyName;
    dto.avatar_path = avatar_path;
    dto.phone = phone;
    dto.about = about;
    dto.isVisibility = isVisibility;

    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
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
      avatar_path,
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
    console.log("user yoxdur");
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    res.status(401).json({
      message: "Email ve ya shifre sehvdir!",
    });
    console.log("parol yalnisdir");
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

  res.status(201).json({
    access_token: new_token,
  });
};

const checkEmail = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
         return;
    }
    const email = user.email;

    if (user.isVerified === true) {
      res.status(400).json({ message: "Email is already verified" });
      return;
    }

    const verifyCode = Math.floor(100000 + Math.random() * 600000);

    const verifyExpiredIn = moment()
      .add(appConfig.VALIDITY_MINUTE_MAIL, "minutes")
      .toDate();

    const updateUser = await User.update(user.id, {
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
      res.status(401).json({ message: "Unauthorized" });
         return;
    }
    console.log(user.isVerified);
    if (user.isVerified === true) {
      res.status(400).json({ message: "Email is already verified" });
      return;
    }

    if (!user.verifyCode) {
      res.status(404).json({
        message: "Verification code not found!",
      });
      return;
    }

    if (user.verifyExpiredIn && (user.verifyExpiredIn.getTime() < Date.now())) {
      res.status(400).json("artıq vaxt bitib, yenidən cəhd edin");
      return;
    }

    if (user.verifyCode !== code) {
      res.status(400).json("kod eyni deyil");
      return;
    }

    await User.update(user.id, {
      isVerified: true,
      verifyCode: null,
      verifyExpiredIn: null,
    });

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const ForgetPass = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  });

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
       return;
  }

  const token = uuidv4();
  const resetExpiredIn = moment()
    .add(appConfig.VALIDITY_MINUTE_MAIL, "minutes")
    .toDate();

  user.passToken = token;
  user.resetExpiredIn = resetExpiredIn;

  await user.save();

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
      .json({
        message: "Password reset email sent successfully.Check your email",
      });
  });
};

const CreatePass = async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword } = req.body;

  const user = await User.findOne({
    where: { passToken: req.params.token },
  });

  const dto = new CreatePassDTO();
  dto.password = newPassword;

  const errors = await validate(dto);

  if (errors.length > 0) {
    res.status(422).json(formatErrors(errors));
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
    res.status(400).json("Əvvəlki parolu yaza bilməzsiniz");
    return;
  }

  const password = await bcrypt.hash(newPassword, 10);

  user.password = password;
  user.passToken = "";

  await user.save();
  res.status(201).send(`${user.email} mailinin password-ü yeniləndi`);
};

const aboutMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
         return;
    }

    const data = await User.findOne({
      where: { id: user.id },
      select: [
        "name",
        "surname",
        "gender",
        "email",
        "isVerified",
        "avatar_path",
        "about",
        "birthdate",
        "phone",
        "created_at",
      ],
    });
  

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const AuthController = () => ({
  register,
  login,
  ForgetPass,
  CreatePass,
  checkEmail,
  verifyEmail,
  aboutMe
});
