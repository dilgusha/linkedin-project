import jwt from "jsonwebtoken";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { appConfig } from "../../consts";
import { User } from "../models/User.model"; 
import { AuthRequest } from "../../types";
import { EStatusType } from "../enum/user.enum";

// const jwtSecret = process.env.JWT_SECRET || 'defaultSecretKey';

// export const useAuth = async (req: AuthRequest, res: Response, next: NextFunction):Promise<void> => {
//     const authHeader = req.headers["authorization"]; 

//     if (!authHeader) {
//          res.status(403).json({ message: "Authorization required" });
//          return
//     }

//     if (!authHeader.startsWith("Bearer ")) {
//          res.status(403).json({ message: "Bearer token is required" });
//          return
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//          res.status(403).json({ message: "Bearer token is required" });
//          return
//     }

//     try {
//         const decoded: any = jwt.verify(token, jwtSecret);
//         const user = await User.findOne({ where: { id: decoded.sub } });

//         if (!user) {
//             res.status(401).json({ message: "User not found!" });
//             return
//         } 

//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Token not valid", error });
//     }
// };

export const useAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    console.log("token yoxdur");
    res.status(401).json({
      message: "Token tapılmadı",
    });
    return;
  }

  const access_token = String(authorizationHeader).split(" ")[1];
  if (!access_token) {
    res.status(401).json({
      message: "Token tapılmadı",
    });
    return;
  }

  try {
    const jwtResult = jwt.verify(
      access_token,
      String(appConfig.JWT_SECRET)
    ) as jwt.JwtPayload;

    const user = await User.findOne({
      where: { id: Number(jwtResult.sub) },
    });

    if (!user) {
      res.status(401).json({ message: "User not found!" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({
      message: "Token etibarsızdır",
      error,
    });
    return;
  }
};

export const roleCheck = (roles: string[]): any => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "İstifadəçi tapılmadı!" });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: "İcazəniz yoxdur!" });
      return;
    }

    if (user.status === EStatusType.DEACTIVE) {
      res.json("Siz active user deyilsiniz!!!");
      return;
    }

    next();
  };
};
