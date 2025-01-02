import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { ICreateParticipant } from '../../../participant/interfaces/participant.interface';

@Injectable()
export class ParticipantQuery extends DbService {

    async findById(id: string) {
        return await this.prisma.participant.findUnique({
            where: { id },
            include: {
                participantOnFieldWork: {
                    select: {
                        index: true,
                        fieldWork: true
                    }
                },
                participantOnProfessionQuestion: {
                    select: {
                        nameProfession: true,
                        codeProfession: true,
                        timeTrack: true,
                    }
                },
                participantOnPersonalityQuestion: {
                    select: {
                        code: true,
                        opsi: true,
                        personality: {
                            select: {
                                question: true,
                                index: true
                            }
                        }
                    }
                }
            }
        });
    }

    async findAll() {
        return await this.prisma.participant.findMany({
            include: {
                participantOnFieldWork: {
                    select: {
                        fieldWork: true
                    }
                }
            }
        });
    }

    async create(data: ICreateParticipant) {
        return await this.prisma.participant.create({ data });
    }

    async delete(id: string) {
        return await this.prisma.participant.delete({
            where: { id },
        });
    }
}
