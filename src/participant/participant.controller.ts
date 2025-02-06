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
  Query,
} from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { HttpHelper } from '../helpers/http.helper';
import { Response } from 'express';
import { Validation } from '../helpers/validation.helper';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { TypeRoleUser } from '@prisma/client';
import { Roles } from '../auth/decorator';
import { CreateParticipantDto } from './dto/participant.dto';
import { SearchPaginationDto } from '../utils/dto/pagination';

@Controller('participant')
export class ParticipantController {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly httpHelper: HttpHelper,
    private readonly validation: Validation,
  ) {}

  @Get()
  async getAllParticipants(@Res() res: Response) {
    try {
      const result = await this.participantService.getAllParticipants();
      return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
    } catch (error) {
      this.validation.errorHandler(res, error);
    }
  }

  @Get('paginate')
  async getAllParticipantsPaginate(
    @Query() dto: SearchPaginationDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.participantService.getManyPaginate(dto);
      return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
    } catch (error) {
      this.validation.errorHandler(res, error);
    }
  }

  @Get(':id')
  async getParticipantById(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.participantService.getParticipantById(id);
      return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
    } catch (error) {
      this.validation.errorHandler(res, error);
    }
  }

  @Post()
  async createParticipant(
    @Body() dto: CreateParticipantDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.participantService.createParticipant(dto);
      return this.httpHelper.formatResponse(res, HttpStatus.CREATED, result);
    } catch (error) {
      this.validation.errorHandler(res, error);
    }
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(TypeRoleUser.SUPERADMIN)
  @Delete(':id')
  async deleteParticipant(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.participantService.deleteParticipant(id);
      return this.httpHelper.formatResponse(res, HttpStatus.OK, null);
    } catch (error) {
      this.validation.errorHandler(res, error);
    }
  }
}
