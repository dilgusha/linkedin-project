import { IsDefined, IsString, MaxLength, MinLength } from "class-validator";

export class CommentCreateDto {
    @IsDefined()
    @IsString()
    @MinLength(1)
    @MaxLength(150)
    content: string;
  }