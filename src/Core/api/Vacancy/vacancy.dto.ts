import { IsString, MaxLength, MinLength } from "class-validator";

export class VacancyCreateDto {
    @IsString()
    description: string;

    
}