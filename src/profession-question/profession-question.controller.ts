import {
    Controller,
    Get,
    Param,
    Put,
    Body,
    Res,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { ProfessionQuestionService } from './profession-question.service';
import { Response } from 'express';
import { HttpHelper } from '../helpers/http.helper';
import { Validation } from '../helpers/validation.helper';
import { JwtGuard, RoleGuard } from 'src/auth/guard';
import { Roles } from '../auth/decorator';
import { TypeRoleUser } from '@prisma/client';
import { UpdateProfessionDto } from './dto/profession-question.dto';

@Controller('profession-question')
export class ProfessionQuestionController {
    constructor(
        private readonly professionQuestionService: ProfessionQuestionService,
        private readonly httpHelper: HttpHelper,
        private readonly validation: Validation,
    ) { }

    @Get()
    async getAllProfessionQuestions(@Res() res: Response) {
        try {
            const result = await this.professionQuestionService.getAllProfessionQuestions();
            return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @Get(':id')
    async getProfessionQuestionById(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            const result = await this.professionQuestionService.getProfessionQuestionById(id);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Put(':id')
    async updateProfessionQuestion(
        @Param('id') id: string,
        @Body() dto: UpdateProfessionDto,
        @Res() res: Response,
    ) {
        try {
            const result = await this.professionQuestionService.updateProfessionQuestion(id, dto);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }
}
