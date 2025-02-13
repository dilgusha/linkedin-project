import { Request } from "express";
import { ERoleType } from "../DAL/models/User.model"; 

export interface IUser {
    id: number;
    name: string;
    surname: string;
    gender: EGenderType;
    email:string;
    password: string;
    verifyCode: number;
    isVerified:boolean;
    verifyExpiredIn:Date;
    role:ERoleType;
    profilePicture:string;
    birthdate: Date;
    phone: string;
    status: EStatusType;
    about: string;
    isVisibility: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
      experiences: Experience[];
      educations: Education[];
      posts: Post[];
    connections: Connection[];
    vacancies: Vacancy[];
}

export interface AuthRequest extends Request {
    user?: IUser;
}