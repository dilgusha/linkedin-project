import { IsDefined, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class PostCreateDto {
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}

export class PostUpdateDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}
