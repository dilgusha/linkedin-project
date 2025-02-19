import { IsDate, IsDefined, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

  export class CreateExperienceDTO {
    @IsDefined()
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    category: string;

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