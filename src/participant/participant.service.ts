import { Injectable } from '@nestjs/common';
import { ParticipantRepository } from './participant.repository';
import { CreateParticipantDto } from './dto/participant.dto';
import { Participant } from '@prisma/client';
import { SearchPaginationDto } from '../utils/dto/pagination';

@Injectable()
export class ParticipantService {
    constructor(
        private readonly participantRepository: ParticipantRepository,
    ) { }

    async getParticipantById(id: string): Promise<Participant> {
        return await this.participantRepository.getThrowParticipantById(id);
    }

    async getAllParticipants(): Promise<Participant[]> {
        return await this.participantRepository.getAllParticipants();
    }

    async createParticipant(dto: CreateParticipantDto) {
        return await this.participantRepository.createParticipant(dto);
    }

    async getManyPaginate(dto: SearchPaginationDto) {
        return await this.participantRepository.getManyPaginate(dto)
    }

    // Delete participant by ID
    async deleteParticipant(id: string): Promise<Participant> {
        return await this.participantRepository.deleteParticipant(id);
    }
}
