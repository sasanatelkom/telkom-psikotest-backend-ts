import { IsOptional, IsString } from 'class-validator';

export class UpdatePersonalityQuestionDto {
    @IsOptional()
    @IsString()
    question: string;

    @IsOptional()
    @IsString()
    opsi1: string;


    @IsOptional()
    @IsString()
    code1: string;

    @IsOptional()
    @IsString()
    opsi2: string;


    @IsOptional()
    @IsString()
    code2: string;

    @IsOptional()
    @IsString()
    groupCode: string;
}
