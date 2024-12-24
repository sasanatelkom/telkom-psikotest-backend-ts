import {
    Body,
    Controller,
    Get,
    Put,
    HttpStatus,
    Param,
    Post,
    Delete,
    Query,
    UseGuards,
    Headers,
    Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard, RoleGuard } from 'src/auth/guard';
import { TypeRoleUser } from '@prisma/client';
import { Roles } from 'src/auth/decorator';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { HttpHelper } from 'src/helpers/http.helper';
import { Response } from 'express';
import { Validation } from 'src/helpers/validation.helper';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly httpHelper: HttpHelper,
        private readonly validation: Validation,
    ) { }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Post()
    async createUser(
        @Body() dto: CreateUserDto,
        @Res() res: Response,
    ) {
        try {
            await this.userService.createUser(dto);
            return this.httpHelper.formatResponse(res, HttpStatus.CREATED, null);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Get()
    async getAllUser(
        @Res() res: Response,
    ) {
        try {
            const result = await this.userService.getAllUser();
            return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Get(':id')
    async getUserById(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            const user = await this.userService.getUserById(id);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, user);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Get('username/:username')
    async getUserByUsername(
        @Param('username') username: string,
        @Res() res: Response,
    ) {
        try {
            const user = await this.userService.getUserByUsername(username);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, user);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
        @Res() res: Response,
    ) {
        try {
            const updatedUser = await this.userService.updateUser(id, dto);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, updatedUser);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.SUPERADMIN)
    @Delete(':id')
    async deleteUser(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            await this.userService.deleteUser(id);
            return this.httpHelper.formatResponse(res, HttpStatus.OK, null);
        } catch (error) {
            this.validation.errorHandler(res, error);
        }
    }
}
