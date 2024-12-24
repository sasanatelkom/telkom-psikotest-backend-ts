import { PartialType } from '@nestjs/mapped-types';
import { TypeRoleUser } from '@prisma/client';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsEnum(TypeRoleUser)
    role: TypeRoleUser;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }