import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { IUpdateProfessionQuestion } from '../../../profession-question/interfaces/profession-question.interface';

@Injectable()
export class ProfessionQuestionQuery extends DbService {
    async findById(id: string) {
        return await this.prisma.professionQuestion.findUnique({
            where: {
                id,
            },
        });
    }

    async findAll() {
        return await this.prisma.professionQuestion.findMany()
    }

    async update(id: string, data: IUpdateProfessionQuestion) {
        return await this.prisma.professionQuestion.update({ where: { id }, data })
    }
}