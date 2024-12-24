import { TypeRoleUser } from '@prisma/client';
import { IsNotEmpty, IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsEnum(TypeRoleUser)
  role: TypeRoleUser;
}
