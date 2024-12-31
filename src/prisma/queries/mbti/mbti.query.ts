import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { IUpdateMbti } from '../../../mbti/interfaces/mbti.interface';

@Injectable()
export class MbtiQuery extends DbService {
    async findById(id: string) {
        return await this.prisma.mbti.findUnique({
            where: {
                id,
            },
        });
    }

    async findAll() {
        return await this.prisma.mbti.findMany()
    }

    async findByCode(codeMbti: string) {
        return await this.prisma.mbti.findUnique({
            where: {
                codeMbti
            },
        });
    }

    async update(id: string, data: IUpdateMbti) {
        return await this.prisma.mbti.update({ where: { id }, data })
    }
}