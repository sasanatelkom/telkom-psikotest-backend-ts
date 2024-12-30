import { Injectable } from '@nestjs/common';
import { ProfessionQuestionRepository } from './profession-question.repository';
import { ProfessionQuestion } from '@prisma/client';
import { UpdateProfessionDto } from './dto/profession-question.dto';

@Injectable()
export class ProfessionQuestionService {
    constructor(
        private readonly professionQuestionRepository: ProfessionQuestionRepository,
    ) { }

    async getProfessionQuestionById(id: string): Promise<ProfessionQuestion> {
        return await this.professionQuestionRepository.getThrowProfessionQuestionById(id);
    }

    async getAllProfessionQuestions(): Promise<ProfessionQuestion[]> {
        return await this.professionQuestionRepository.getAllProfessionQuestions();
    }

    async updateProfessionQuestion(
        id: string,
        dto: UpdateProfessionDto,
    ): Promise<ProfessionQuestion> {
        return await this.professionQuestionRepository.updateProfessionQuestion(id, dto);
    }
}
