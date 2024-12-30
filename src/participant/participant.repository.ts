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

    async createParticipant(dto: CreateParticipantDto) {
        const {
            name,
            schoolName,
            email,
            phoneNumber,
            orientation,
            class: kelas,
            fieldWorks,
            answerProfessionQuestions,
            answerPersonalityQuestions,
        } = dto;

        // Step 1: Validate fieldWorkIds to ensure all field works exist
        const fieldWorkIds = fieldWorks.map((fieldWork) => fieldWork.idFieldWork);
        await this.fieldWorkRepository.checkAllFieldWorksExist(fieldWorkIds);

        // Step 2: Calculate and sort profession stats, and get top two professions
        const professionStats = this.calculateProfessionStats(answerProfessionQuestions);
        const sortedProfessions = this.sortProfessions(professionStats);
        const { codeSds, codeSds1, codeSds2 } = this.getTopTwoProfessions(sortedProfessions);

        // Step 3: Prepare data for participantOnProfessionQuestion and participantOnPersonalityQuestion
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

        const participantOnPersonalityQuestionData = answerPersonalityQuestions.map(({
            opsi,
            code,
            groupCodeQuestion,
            idPersonalityQuestion
        }) => ({
            opsi,
            code,
            groupCodeQuestion,
            idPersonalityQuestion,
        }));

        // Step 4: Calculate MBTI profile from personality answers
        const mbti = this.calculateMbti(answerPersonalityQuestions);

        // Step 5: Create the participant with the necessary relations
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
            mbti,
            participantOnFieldWork: {
                create: fieldWorks.map(({ idFieldWork, index }) => ({
                    idFieldWork,
                    index,
                })),
            },
            participantOnProfessionQuestion: {
                create: participantOnProfessionQuestionData,
            },
            participantOnPersonalityQuestion: {
                create: participantOnPersonalityQuestionData,
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

    calculateMbti(answerPersonalityQuestions: {
        opsi: string;
        code: string;
        groupCodeQuestion: string;
        idPersonalityQuestion: string;
    }[]): string {
        const groupCounts = {};

        // Count occurrences of each code within each groupCodeQuestion
        answerPersonalityQuestions.forEach(({ groupCodeQuestion, code }) => {
            if (!groupCounts[groupCodeQuestion]) {
                groupCounts[groupCodeQuestion] = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }; // Initialize all groups with zero counts
            }
            groupCounts[groupCodeQuestion][code]++;
        });

        // Calculate MBTI based on the highest counts in each group
        let mbti = '';
        const mbtiGroups = ['IE', 'SN', 'TF', 'PJ']; // List of MBTI group codes

        mbtiGroups.forEach((groupCodeQuestion) => {
            const counts = groupCounts[groupCodeQuestion];
            if (groupCodeQuestion === 'IE') {
                mbti += counts.I > counts.E ? 'I' : 'E';
            } else if (groupCodeQuestion === 'SN') {
                mbti += counts.S > counts.N ? 'S' : 'N';
            } else if (groupCodeQuestion === 'TF') {
                mbti += counts.T > counts.F ? 'T' : 'F';
            } else if (groupCodeQuestion === 'PJ') {
                mbti += counts.J > counts.P ? 'J' : 'P';
            }
        });

        return mbti;
    }
}
