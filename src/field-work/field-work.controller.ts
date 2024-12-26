import {
    Body,
    Controller,
    Get,
    Put,
    HttpStatus,
    Param,
    Delete,
    Res,
    UseGuards,
} from '@nestjs/common';
import { FieldWorkService } from './field-work.service';
import { HttpHelper } from '../helpers/http.helper';
import { Response } from 'express';
import { Validation } from '../helpers/validation.helper';

@Controller('field-work')
export class FieldWorkController {
    constructor(
        private readonly fieldWorkService: FieldWorkService,
        private readonly httpHelper: HttpHelper,
        private readonly validation: Validation,
    ) { }

    @Get()
    async getAllFieldWorks(@Res() res: Response) {
        try {
            const fieldWorks = await this.fieldWorkService.getAllFieldWorks();
            return this.httpHelper.formatResponse(res, HttpStatus.OK, fieldWorks);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @Get(':id')
    async getFieldWorkById(@Param('id') id: string, @Res() res: Response) {
        try {
            const fieldWork = await this.fieldWorkService.getFieldWorkById(id);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, fieldWork);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }
}
