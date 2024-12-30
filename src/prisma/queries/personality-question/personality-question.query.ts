import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { IUpdatePersonalityQuestion } from '../../../personality-question/interfaces/personality-question.interface';

@Injectable()
export class PersonalityQuestionQuery extends DbService {
    async findById(id: string) {
        return await this.prisma.personalityQuestion.findUnique({
            where: {
                id,
            },
        });
    }

    async findAll() {
        return await this.prisma.personalityQuestion.findMany()
    }

    async update(id: string, data: IUpdatePersonalityQuestion) {
        return await this.prisma.personalityQuestion.update({ where: { id }, data })
    }
}