import { Injectable } from '@nestjs/common';
import { ParticipantQuery } from '../prisma/queries/participant/participant.query';
import { CreateParticipantDto } from './dto/participant.dto';
import { CustomError } from '../utils/error/custom-error';
import { Participant } from '@prisma/client';
import { FieldWorkRepository } from '../field-work/field-work.repository';

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
        const {
            name,
            schoolName,
            email,
            phoneNumber,
            orientation,
            class: kelas,
            fieldWorks,
            answerProfessionQuestions,
        } = dto;

        // Step 1: Validate fieldWorkIds to ensure all field works exist
        const fieldWorkIds = fieldWorks.map((fieldWork) => fieldWork.idFieldWork);
        await this.fieldWorkRepository.checkAllFieldWorksExist(fieldWorkIds);

        // Step 2: Calculate the frequency and total time for each profession code
        const professionStats = this.calculateProfessionStats(answerProfessionQuestions);

        // Step 3: Sort the professions based on frequency and total time
        const sortedProfessions = this.sortProfessions(professionStats);

        // Step 4: Get the top two professions for codeSds, codeSds1, and codeSds2
        const { codeSds, codeSds1, codeSds2 } = this.getTopTwoProfessions(sortedProfessions);

        // Step 5: Prepare the participantOnProfessionQuestion data
        const participantOnProfessionQuestionData = answerProfessionQuestions.map(({
            nameProfession,
            codeProfession,
            timeTrack,
            idProfessionQuestion
        }) => ({
            nameProfession,
            codeProfession,
            timeTrack,
            idProfessionQuestion,
        }));

        // Step 6: Create the participant with the necessary relations
        return await this.participantQuery.create({
            name,
            class: kelas,
            orientation,
            schoolName,
            email,
            phoneNumber,
            codeSds,
            codeSds1,
            codeSds2,
            participantOnFieldWork: {
                create: fieldWorks.map(({ idFieldWork, index }) => ({
                    idFieldWork,
                    index,
                })),
            },
            participantOnProfessionQuestion: {
                create: participantOnProfessionQuestionData,
            },
        });
    }

    async deleteParticipant(id: string): Promise<Participant> {
        const participant = await this.getThrowParticipantById(id);
        return await this.participantQuery.delete(participant.id);
    }

    /*
   |--------------------------------------------------------------------------
   | Helper
   |--------------------------------------------------------------------------
   */
    calculateProfessionStats(answerProfessionQuestions: { codeProfession: string; timeTrack: number }[]) {
        return answerProfessionQuestions.reduce((acc, { codeProfession, timeTrack }) => {
            if (!acc[codeProfession]) {
                acc[codeProfession] = { totalTime: 0, frequency: 0 };
            }
            acc[codeProfession].totalTime += timeTrack;
            acc[codeProfession].frequency += 1;
            return acc;
        }, {});
    }

    sortProfessions(professionStats: Record<string, { totalTime: number; frequency: number }>) {
        return Object.keys(professionStats)
            .map(codeProfession => ({
                codeProfession,
                ...professionStats[codeProfession],
            }))
            .sort((a, b) => {
                if (a.frequency === b.frequency) {
                    return a.totalTime - b.totalTime;
                }
                return b.frequency - a.frequency;
            });
    }

    getTopTwoProfessions(sortedProfessions: { codeProfession: string; totalTime: number; frequency: number }[]) {
        const topTwoProfessions = sortedProfessions.slice(0, 2);
        const codeSds = topTwoProfessions.map(p => p.codeProfession).join('');
        const codeSds1 = topTwoProfessions[0]?.codeProfession || '';
        const codeSds2 = topTwoProfessions[1]?.codeProfession || '';
        return { codeSds, codeSds1, codeSds2 };
    }


}
