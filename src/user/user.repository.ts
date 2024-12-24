import { BadRequestException, Injectable } from '@nestjs/common';
import { UserQuery } from '../prisma/queries/user/user.query';
@Injectable()
export class UserRepository {
    constructor(
        private readonly userQuery: UserQuery,
    ) { }

    async getThrowUserById(id: string) {
        const user = await this.userQuery.findById(id);
        if (!user) throw new BadRequestException('User tidak ditemukan');
        return user
    }
    async getThrowUserByUsername(username: string) {
        const user = await this.userQuery.findByUsername(username);
        if (!user) {
            throw new BadRequestException('User belum terdaftar');
        }
        return user;
    }
}