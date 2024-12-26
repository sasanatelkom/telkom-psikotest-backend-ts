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
import { ReportService } from './report.service';
import { HttpHelper } from '../helpers/http.helper';
import { Response } from 'express';
import { Validation } from '../helpers/validation.helper';

@Controller('report')
export class ReportController {
    constructor(
        private readonly reportService: ReportService,
        private readonly httpHelper: HttpHelper,
        private readonly validation: Validation,
    ) { }

    @Get("admin/dashboard")
    async getDashboardSuperAdmin(@Res() res: Response) {
        try {
            const result = await this.reportService.getDashboardAdmin();
            return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }
}
