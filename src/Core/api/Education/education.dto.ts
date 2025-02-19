import {
  IsDate,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { EDegreeType } from "../../app/enums";

export class CreateEducationDTO {
  @IsDefined()
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  schoolName: string;

  @IsOptional()
  @IsEnum(EDegreeType)
  degree: EDegreeType;

  @IsDefined()
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  faculty: string;

  @IsDefined()
  @IsDate()
  startDate: Date;

  @IsDefined()
  @IsDate()
  endDate: Date;
}
