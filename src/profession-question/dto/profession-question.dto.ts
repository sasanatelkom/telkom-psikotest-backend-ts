import { IsOptional, IsString } from 'class-validator';

export class UpdateProfessionDto {
    @IsOptional()
    @IsString()
    question: string;

    @IsOptional()
    @IsString()
    profession1: string;


    @IsOptional()
    @IsString()
    code1: string;

    @IsOptional()
    @IsString()
    profession2: string;


    @IsOptional()
    @IsString()
    code2: string;
}
