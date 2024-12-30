import { Injectable } from '@nestjs/common';
import { ProfessionQuestionQuery } from '../prisma/queries/profession-question/profession-question.query';
import { CustomError } from '../utils/error/custom-error';
import { ProfessionQuestion } from '@prisma/client';
import { UpdateProfessionDto } from './dto/profession-question.dto';

@Injectable()
export class ProfessionQuestionRepository {
    constructor(
        private readonly professionQuestionQuery: ProfessionQuestionQuery,
    ) { }

    async getThrowProfessionQuestionById(id: string): Promise<ProfessionQuestion> {
        const professionQuestion = await this.professionQuestionQuery.findById(id);
        if (!professionQuestion) throw new CustomError('Pertanyaan tidak ditemukan', 404);
        return professionQuestion;
    }

    async getAllProfessionQuestions(): Promise<ProfessionQuestion[]> {
        return await this.professionQuestionQuery.findAll();
    }

    async updateProfessionQuestion(
        id: string,
        dto: UpdateProfessionDto,
    ): Promise<ProfessionQuestion> {
        const { question, profession1, profession2, code1, code2 } = dto
        await this.getThrowProfessionQuestionById(id);
        return await this.professionQuestionQuery.update(id, {
            question,
            profession1,
            profession2,
            code1,
            code2
        });
    }
}
