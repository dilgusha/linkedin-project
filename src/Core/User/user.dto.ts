import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ERoleType } from "../../DAL/enum/user.enum";

export class CreateUserDTO {
  @IsDefined({ message: "Name is required" })
  @IsString()
  @MaxLength(25, { message: "Name is too long" })
  @MinLength(3, { message: "En az 3 simvol olmalidir" })
  name: string;

  @IsDefined()
  @IsString()
  @MaxLength(50)
  surname: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsDefined()
  @IsEmail({}, { message: "Email düzgün formatda olmalıdır." })
  email: string;

  @IsDefined()
  @IsString()
  @MaxLength(15)
  @MinLength(8)
  password: string;

  @IsDefined()
  @IsDate()
  birthdate: Date;

  @IsOptional()
  @IsEnum(ERoleType)
  role: ERoleType;

  @IsOptional()
  @IsString()
  profilePicture: string;

  @IsDefined()
  @IsPhoneNumber()
  @Matches(/^\+994\d{9}$/, {
    message: "Phone number must be in +994XXXXXXXXX format",
  })
  phone: string;

  @IsOptional()
  @IsString()
  about: string;

  @IsOptional()
  @IsString()
  companyName: string;

  @IsOptional()
  @IsBoolean()
  isVisibility: boolean;
}

export class EditUserDTO {
  @IsOptional({ message: "Name is required" })
  @IsString()
  @MaxLength(25, { message: "Name is too long" })
  @MinLength(3, { message: "En az 3 simvol olmalidir" })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  surname: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsEmail({}, { message: "Email düzgün formatda olmalıdır." })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  @MinLength(8)
  password: string;
  
  @IsOptional()
  @IsString()
  companyName: string;

  @IsOptional()
  @IsDate()
  birthdate: Date;

  @IsOptional()
  @IsPhoneNumber()
  @Matches(/^\+994\d{9}$/, {
    message: "Phone number must be in +994XXXXXXXXX format",
  })
  phone: string;

  @IsOptional()
  @IsString()
  about: string;

  @IsOptional()
  @IsBoolean()
  isVisibility: boolean;
}

// export class  verifyUserDTO{
//     @IsDefined()
//     @IsNumber()
//     verifyCode: number;

//     @IsDefined()
//     @IsDate()
//     verifyExpiredIn:Date

//     @IsDefined()
//     @IsBoolean()
//     isVerified: boolean;
// }
