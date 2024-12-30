import { Injectable } from '@nestjs/common';
import { PersonalityQuestionQuery } from '../prisma/queries/personality-question/personality-question.query';
import { CustomError } from '../utils/error/custom-error';
import { PersonalityQuestion } from '@prisma/client';
import { UpdatePersonalityQuestionDto } from './dto/personality-question.dto';

@Injectable()
export class PersonalityQuestionRepository {
    constructor(
        private readonly personalityQuestionQuery: PersonalityQuestionQuery,
    ) { }

    async getThrowPersonalityQuestionById(id: string): Promise<PersonalityQuestion> {
        const personalityQuestion = await this.personalityQuestionQuery.findById(id);
        if (!personalityQuestion) throw new CustomError('Pertanyaan tidak ditemukan', 404);
        return personalityQuestion;
    }

    async getAllPersonalityQuestions(): Promise<PersonalityQuestion[]> {
        return await this.personalityQuestionQuery.findAll();
    }

    async updatePersonalityQuestion(
        id: string,
        dto: UpdatePersonalityQuestionDto,
    ): Promise<PersonalityQuestion> {
        const { question, opsi1, opsi2, code1, code2, groupCode } = dto
        await this.getThrowPersonalityQuestionById(id);
        return await this.personalityQuestionQuery.update(id, {
            question,
            opsi1,
            opsi2,
            code1,
            code2,
            groupCode
        });
    }
}
