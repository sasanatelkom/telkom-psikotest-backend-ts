import {
    IsString,
    IsEmail,
    IsEnum,
    IsArray,
    IsNotEmpty,
    ValidateNested,
    IsInt,
    Min,
} from 'class-validator';
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

class AnswerProfessionQuestionDto {
    @IsNotEmpty()
    @IsString()
    nameProfession: string;

    @IsNotEmpty()
    @IsString()
    codeProfession: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    timeTrack: number; // Waktu dalam detik

    @IsNotEmpty()
    @IsString()
    idProfessionQuestion: string;
}

class AnswerPersonalityQuestionDto {
    @IsNotEmpty()
    @IsString()
    opsi: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    groupCodeQuestion: string;

    @IsNotEmpty()
    @IsString()
    idPersonalityQuestion: string;
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

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerProfessionQuestionDto)
    answerProfessionQuestions: AnswerProfessionQuestionDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerPersonalityQuestionDto)
    answerPersonalityQuestions: AnswerPersonalityQuestionDto[];
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) { }