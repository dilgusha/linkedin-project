import {
    IsOptional,
    IsString,
  } from "class-validator";
  
  export class EditUserByAdminDTO {
    @IsOptional()
    @IsString()
    role: string;    

    @IsOptional()
    @IsString()
    status: string;  
  }