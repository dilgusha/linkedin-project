import {
  IsBoolean,
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
import { ERoleType } from "../../app/enums";
import { Type } from "class-transformer";

export class CreateUserByAdminDTO {
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
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @IsOptional()
  // @IsDate()
  // @Type(() => Date)
  birthdate: Date;

  @IsOptional()
  @IsEnum(ERoleType)
  role: ERoleType;

  @IsOptional()
  @IsString()
  avatar_path: string;

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
  @IsString()
  companyName: string;

  @IsOptional()
  @IsBoolean()
  isVisibility: boolean;
}

export class EditUserByAdminDTO {
  @IsOptional()
  @IsString()
  role: string;
}
