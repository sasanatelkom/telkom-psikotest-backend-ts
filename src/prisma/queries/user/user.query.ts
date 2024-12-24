import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { ICreateUser, IUpdateUser } from 'src/user/interfaces/user.interface';


@Injectable()
export class UserQuery extends DbService {
    async findById(id: string) {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findByUsername(username: string) {
        return await this.prisma.user.findFirst({
            where: {
                username
            },
        });
    }

    async findAllWithoutPassword() {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
            },
        });
    }

    async create(data: ICreateUser) {
        return await this.prisma.user.create({ data })
    }

    async update(id: string, data: IUpdateUser) {
        return await this.prisma.user.update({ where: { id }, data })
    }

    async delete(id: string) {
        return await this.prisma.user.delete({ where: { id } })
    }
}