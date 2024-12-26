import { IsString, IsEmail, IsEnum, IsArray, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { TypeOrientation } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateParticipantDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    schoolName: string;

    @IsNotEmpty()
    @IsString()
    class: string;

    @IsNotEmpty()
    @IsEnum(TypeOrientation)
    orientation: TypeOrientation;

    @IsArray()
    @ArrayNotEmpty()
    idFieldWorks: string[];
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) { }

