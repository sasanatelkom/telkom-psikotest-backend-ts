import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMbtiDto {
    @IsString()
    @IsNotEmpty()
    naration: string;
}
