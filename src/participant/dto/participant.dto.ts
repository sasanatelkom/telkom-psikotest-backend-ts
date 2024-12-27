import { IsString, IsEmail, IsEnum, IsArray, IsNotEmpty, ValidateNested, IsInt, Min } from 'class-validator';
import { TypeOrientation } from '@prisma/client';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

class FieldWorkDto {
    @IsNotEmpty()
    @IsString()
    idFieldWork: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    index: number;
}

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
    @ValidateNested({ each: true })
    @Type(() => FieldWorkDto)
    fieldWorks: FieldWorkDto[];
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) { }
