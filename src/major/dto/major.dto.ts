import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMajorDto {
    @IsString()
    @IsNotEmpty()
    url: string;
}
