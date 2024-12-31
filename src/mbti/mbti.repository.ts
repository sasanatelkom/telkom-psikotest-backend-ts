import { Injectable } from '@nestjs/common';
import { IUpdateMbti } from '../mbti/interfaces/mbti.interface';
import { MbtiQuery } from '../prisma/queries/mbti/mbti.query';
import { CustomError } from '../utils/error/custom-error';

@Injectable()
export class MbtiRepository {
    constructor(
        private readonly mbtiQuery: MbtiQuery
    ) { }

    async getThrowMbtiById(id: string) {
        const mbti = await this.mbtiQuery.findById(id);
        if (!mbti) {
            throw new CustomError('Mbti tidak ditemukan', 404);
        }
        return mbti;
    }

    async getAllMbtis() {
        return await this.mbtiQuery.findAll();
    }

    async updateMbti(id: string, data: IUpdateMbti) {
        await this.getThrowMbtiById(id);
        return await this.mbtiQuery.update(id, data);
    }

    async getThrowMbtiByCode(code: string) {
        const mbti = await this.mbtiQuery.findByCode(code);
        if (!mbti) {
            throw new CustomError('Mbti tidak ditemukan', 404);
        }
        return mbti;
    }
}
