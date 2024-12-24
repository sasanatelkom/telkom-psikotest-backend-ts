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
import { MajorService } from './major.service';
import { HttpHelper } from 'src/helpers/http.helper';
import { Response } from 'express';
import { Validation } from 'src/helpers/validation.helper';
import { JwtGuard, RoleGuard } from 'src/auth/guard';
import { TypeRoleUser } from '@prisma/client';
import { Roles } from 'src/auth/decorator';
import { UpdateMajorDto } from './dto/major.dto';

@Controller('major')
export class MajorController {
    constructor(
        private readonly majorService: MajorService,
        private readonly httpHelper: HttpHelper,
        private readonly validation: Validation,
    ) { }

    @Get()
    async getAllMajors(
        @Res() res: Response,
    ) {
        try {
            const majors = await this.majorService.getAllMajors();
            return this.httpHelper.formatResponse(res, HttpStatus.OK, majors);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @Get(':id')
    async getMajorById(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            const major = await this.majorService.getMajorById(id);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, major);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Put(':id')
    async updateMajor(
        @Param('id') id: string,
        @Body() dto: UpdateMajorDto,
        @Res() res: Response,
    ) {
        try {
            const updatedMajor = await this.majorService.updateMajor(id, dto);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, updatedMajor);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Delete(':id')
    async deleteMajor(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            await this.majorService.deleteMajor(id);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, null);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }
}
