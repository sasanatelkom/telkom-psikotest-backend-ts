import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserQuery } from '../prisma/queries/user/user.query';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { CustomError } from 'utils/error/custom-error';

@Injectable()
export class UserRepository {
    constructor(
        private readonly userQuery: UserQuery,
    ) { }

    async getThrowUserById(id: string) {
        const user = await this.userQuery.findById(id);
        if (!user) throw new CustomError('User tidak ditemukan', 404);
        return user;
    }

    async getThrowUserByUsername(username: string) {
        const user = await this.userQuery.findByUsername(username);
        if (!user) {
            throw new CustomError('User belum terdaftar', 404);
        }
        return user;
    }

    async checkIsAlreadyUsername(username: string) {
        const user = await this.userQuery.findByUsername(username);
        if (user) throw new CustomError('username sudah digunakan', 400);
        return;
    }

    async createUser(dto: CreateUserDto) {
        await this.checkIsAlreadyUsername(dto.username);

        // hashing password from body dto
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(dto.password, salt);
        dto.password = hash;
        return await this.userQuery.create(dto);
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        const user = await this.getThrowUserById(id);

        // If the username is updated, check if it's already in use
        if (dto.username && dto.username !== user.username) {
            await this.checkIsAlreadyUsername(dto.username);
        }

        // If password is updated, hash it
        if (dto.password) {
            const salt = await bcrypt.genSalt();
            dto.password = await bcrypt.hash(dto.password, salt);
        }

        return await this.userQuery.update(id, dto);
    }

    async deleteUser(id: string) {
        const user = await this.getThrowUserById(id);
        return await this.userQuery.delete(user.id);
    }
}
