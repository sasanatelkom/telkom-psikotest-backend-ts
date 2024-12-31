import {
    Body,
    Controller,
    Get,
    Put,
    HttpStatus,
    Param,
    Post,
    Delete,
    Res,
    UseGuards,
} from '@nestjs/common';
import { MbtiService } from './mbti.service';
import { HttpHelper } from '../helpers/http.helper';
import { Response } from 'express';
import { Validation } from '../helpers/validation.helper';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { TypeRoleUser } from '@prisma/client';
import { Roles } from '../auth/decorator';
import { UpdateMbtiDto } from './dto/mbti.dto';

@Controller('mbti')
export class MbtiController {
    constructor(
        private readonly mbtiService: MbtiService,
        private readonly httpHelper: HttpHelper,
        private readonly validation: Validation,
    ) { }

    @Get()
    async getAllMbtis(
        @Res() res: Response,
    ) {
        try {
            const mbtis = await this.mbtiService.getAllMbtis();
            return this.httpHelper.formatResponse(res, HttpStatus.OK, mbtis);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @Get(':id')
    async getMbtiById(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            const mbti = await this.mbtiService.getMbtiById(id);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, mbti);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Put(':id')
    async updateMbti(
        @Param('id') id: string,
        @Body() dto: UpdateMbtiDto,
        @Res() res: Response,
    ) {
        try {
            const updatedMbti = await this.mbtiService.updateMbti(id, dto);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, updatedMbti);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }
}
