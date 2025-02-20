import {
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Category } from "../../../DAL/models/Category.model";
import { Type } from "class-transformer";

export class CreateExperienceDTO {
  @IsDefined()
  categories: Category[];

  @IsDefined()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  company: string;

  @IsDefined()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  location: string;

  @IsDefined()
  // @IsDate()
  // @Type(() => Date)
  startDate: Date;

  @IsDefined()
  // @IsDate()
  // @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  description: string;
}
