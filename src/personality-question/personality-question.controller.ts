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
import { PersonalityQuestionService } from './personality-question.service';
import { Response } from 'express';
import { HttpHelper } from '../helpers/http.helper';
import { Validation } from '../helpers/validation.helper';
import { JwtGuard, RoleGuard } from 'src/auth/guard';
import { Roles } from '../auth/decorator';
import { TypeRoleUser } from '@prisma/client';
import { UpdatePersonalityQuestionDto } from './dto/personality-question.dto';

@Controller('personality-question')
export class PersonalityQuestionController {
    constructor(
        private readonly personalityQuestionService: PersonalityQuestionService,
        private readonly httpHelper: HttpHelper,
        private readonly validation: Validation,
    ) { }

    @Get()
    async getAllPersonalityQuestions(@Res() res: Response) {
        try {
            const result = await this.personalityQuestionService.getAllPersonalityQuestions();
            return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @Get(':id')
    async getPersonalityQuestionById(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            const result = await this.personalityQuestionService.getPersonalityQuestionById(id);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Put(':id')
    async updatePersonalityQuestion(
        @Param('id') id: string,
        @Body() dto: UpdatePersonalityQuestionDto,
        @Res() res: Response,
    ) {
        try {
            const result = await this.personalityQuestionService.updatePersonalityQuestion(id, dto);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }
}
