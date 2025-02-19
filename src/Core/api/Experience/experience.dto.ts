import { IsDate, IsDefined, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Category } from "../../../DAL/models/Category.model";

  export class CreateExperienceDTO {
    @IsDefined()
    @IsNumber()
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
    @IsDate()
    startDate: Date;

    @IsDefined()
    @IsDate()
    endDate: Date;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @MinLength(3)
    description: string;
  }