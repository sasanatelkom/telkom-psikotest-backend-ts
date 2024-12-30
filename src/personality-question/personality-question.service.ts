import { Injectable } from '@nestjs/common';
import { PersonalityQuestionRepository } from './personality-question.repository';
import { PersonalityQuestion } from '@prisma/client';
import { UpdatePersonalityQuestionDto } from './dto/personality-question.dto';

@Injectable()
export class PersonalityQuestionService {
    constructor(
        private readonly personalityQuestionRepository: PersonalityQuestionRepository,
    ) { }

    async getPersonalityQuestionById(id: string): Promise<PersonalityQuestion> {
        return await this.personalityQuestionRepository.getThrowPersonalityQuestionById(id);
    }

    async getAllPersonalityQuestions(): Promise<PersonalityQuestion[]> {
        return await this.personalityQuestionRepository.getAllPersonalityQuestions();
    }

    async updatePersonalityQuestion(
        id: string,
        dto: UpdatePersonalityQuestionDto,
    ): Promise<PersonalityQuestion> {
        return await this.personalityQuestionRepository.updatePersonalityQuestion(id, dto);
    }
}
