import { Injectable } from '@nestjs/common';
import { ParticipantQuery } from '../prisma/queries/participant/participant.query';
import { CreateParticipantDto } from './dto/participant.dto';
import { CustomError } from '../utils/error/custom-error';
import { Participant } from '@prisma/client';
import { FieldWorkRepository } from 'src/field-work/field-work.repository';

@Injectable()
export class ParticipantRepository {
    constructor(
        private readonly participantQuery: ParticipantQuery,
        private readonly fieldWorkRepository: FieldWorkRepository,
    ) { }

    async getThrowParticipantById(id: string): Promise<Participant> {
        const participant = await this.participantQuery.findById(id);
        if (!participant) throw new CustomError('Peserta tidak ditemukan', 404);
        return participant;
    }

    async getAllParticipants(): Promise<Participant[]> {
        return await this.participantQuery.findAll();
    }

    async createParticipant(dto: CreateParticipantDto): Promise<Participant> {
        const { name, schoolName, email, phoneNumber, orientation, class: kelas } = dto;

        await this.fieldWorkRepository.checkAllFieldWorksExist(dto.idFieldWorks);

        // Create the participant
        return await this.participantQuery.create({
            name,
            class: kelas,
            orientation,
            schoolName,
            email,
            phoneNumber,
            participantOnFieldWork: {
                create: dto.idFieldWorks.map((fieldWork) => ({
                    idFieldWork: fieldWork
                }))
            }
        });
    }



    async deleteParticipant(id: string): Promise<Participant> {
        const participant = await this.getThrowParticipantById(id);
        return await this.participantQuery.delete(participant.id);
    }
}
