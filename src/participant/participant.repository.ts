import { Injectable } from '@nestjs/common';
import { ParticipantQuery } from '../prisma/queries/participant/participant.query';
import { CreateParticipantDto } from './dto/participant.dto';
import { CustomError } from '../utils/error/custom-error';
import { Participant } from '@prisma/client';
import { FieldWorkRepository } from '../field-work/field-work.repository';
import { MbtiRepository } from '../mbti/mbti.repository';
import { formulaCarierData, formulaOrientationData, formulaProgramData } from '../../prisma/datas/formula-carier.data';

@Injectable()
export class ParticipantRepository {
    constructor(
        private readonly participantQuery: ParticipantQuery,
        private readonly fieldWorkRepository: FieldWorkRepository,
        private readonly mbtiRepository: MbtiRepository,
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
        const fieldWorkIds = fieldWorks
            .sort((a, b) => a.index - b.index)
            .map((fieldWork) => fieldWork.idFieldWork)

        const fieldWorksDb = await this.fieldWorkRepository.checkAllFieldWorksExist(fieldWorkIds);

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

        // Step 5: Get MBTI Naration
        const mbtiNaration = (await this.mbtiRepository.getThrowMbtiByCode(`${mbti}-${codeSds1}`)).naration

        const suggestMajor = this.calculateSuggestMajor({
            orientation,
            codeSds,
            codeSds1,
            codeSds2,
            fieldWork1: fieldWorksDb.find(item => item.id == fieldWorks[0].idFieldWork).name,
            fieldWork2: fieldWorksDb.find(item => item.id == fieldWorks[1].idFieldWork).name,
            fieldWork3: fieldWorksDb.find(item => item.id == fieldWorks[2].idFieldWork).name,
            mbti: `${mbti}-${codeSds1}`
        });

        // Gunakan reduce untuk mengambil nilai tertinggi per program
        const highestScoresPerProgram = suggestMajor.reduce((acc, current) => {
            // Cek jika program sudah ada di accumulator
            if (!acc[current.program] || current.totalScore > acc[current.program].totalScore) {
                acc[current.program] = current;
            }
            return acc;
        }, {} as { [key: string]: { program: string; totalScore: number } });

        // Mengambil array dari accumulator dan mengurutkan berdasarkan totalScore tertinggi
        const top5Programs = Object.values(highestScoresPerProgram)
            .sort((a, b) => (b as { totalScore: number }).totalScore - (a as { totalScore: number }).totalScore)
            .slice(0, 5);

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
            mbti,
            mbtiNaration,
            suggestPrograms: top5Programs.toString(),
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
   | Helper Prefession
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

    /*
   |--------------------------------------------------------------------------
   | Helper MBTI
   |--------------------------------------------------------------------------
   */
    calculateMbti(answerPersonalityQuestions: {
        opsi: string;
        code: string;
        groupCodeQuestion: string;
        idPersonalityQuestion: string;
    }[]): string {
        const groupCounts = {};

        answerPersonalityQuestions.forEach(({ groupCodeQuestion, code }) => {
            if (!groupCounts[groupCodeQuestion]) {
                groupCounts[groupCodeQuestion] = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
            }
            groupCounts[groupCodeQuestion][code]++;
        });

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

    /*
    |--------------------------------------------------------------------------
    | Helper Suggest Major
    |--------------------------------------------------------------------------
    */

    calculateSuggestMajor(param: {
        mbti: string,
        orientation: string,
        fieldWork1: string,
        fieldWork2: string,
        fieldWork3: string,
        codeSds: string,
        codeSds1: string,
        codeSds2: string,
    }) {
        // Step 0: prepare data formula & orientation
        const { orientation, fieldWork1, fieldWork2, fieldWork3, codeSds, codeSds1, codeSds2, mbti } = param;

        // Array to hold the results
        const results = [];

        // Step 1: looping formula
        for (const formula of formulaCarierData) {
            // Step 2: concat orientation
            // ! kolom excel
            const concatOrientation = `${orientation}-${formula.orientation}`;

            // Step 3: get orientation score
            // ! kolom excel
            const orientationScore = formulaOrientationData.find(item => item.category === concatOrientation)?.persentage ?? 0;

            // Step 4: get fieldWorkScore
            // ! kolom excel
            const fieldWorkScore = this.calculateFormulaFieldWork([formula.cluster1, formula.cluster2, formula.cluster3], [fieldWork1, fieldWork2, fieldWork3]);

            // Step 5: get cc
            // ! kolom excel
            const cc1 = this.calculateCC([formula.cluster1, formula.cluster2, formula.cluster3], fieldWork1);
            const cc2 = this.calculateCC([formula.cluster1, formula.cluster2, formula.cluster3], fieldWork2);
            const cc3 = this.calculateCC([formula.cluster1, formula.cluster2, formula.cluster3], fieldWork3);

            // Step 6: calculate codeSds, if same give 300
            const codeSdsScore = codeSds === formula.codeSDS ? 300 : 0;
            const codeSds11Score = codeSds1 === formula.code1 ? 50 : 40;
            const codeSds22Score = codeSds2 === formula.code2 ? 25 : 20;
            const codeSds12Score = codeSds1 === formula.code2 ? 25 : 0;
            const codeSds21Score = codeSds2 === formula.code1 ? 10 : 0;

            // Step 7: calculate score
            const score = orientationScore + fieldWorkScore + cc1 + cc2 + cc3 + codeSdsScore + codeSds11Score + codeSds22Score + codeSds12Score + codeSds21Score;

            // Step 8: calculate score MBTI
            const mbtiProfession = formulaProgramData.find(item => item.mbti === mbti && item.program === formula.program);
            const mbtiScore = mbtiProfession ? 1000 : 0;

            // Step 9: calculate total score
            const totalScore = orientationScore + fieldWorkScore + cc1 + cc2 + cc3 + codeSdsScore + codeSds11Score + codeSds22Score + codeSds12Score + codeSds21Score + score + mbtiScore;

            results.push({
                program: formula.program,
                totalScore,
            });
        }

        // Return the array of results
        return results;
    }


    calculateFormulaFieldWork(data: string[], criteria: string[]): number {
        // Memastikan bahwa criteria memiliki tepat 3 elemen
        if (criteria.length !== 3) {
            throw new Error("Criteria array must contain exactly 3 elements");
        }

        const [criteria1, criteria2, criteria3] = criteria;

        // Menghitung jumlah kemunculan masing-masing kriteria dalam data
        const countCriteria1 = data.filter(item => item === criteria1).length;
        const countCriteria2 = data.filter(item => item === criteria2).length;
        const countCriteria3 = data.filter(item => item === criteria3).length;

        // Menghitung hasil sesuai dengan rumus Excel
        const result = (countCriteria1 * 100) + (countCriteria2 * 100) + (countCriteria3 * 100);

        return result;
    }

    calculateCC(data: string[], criteria: string): number {
        if (data.length !== 3) {
            throw new Error("Data array must contain exactly 3 elements");
        }

        // Menghitung jumlah kemunculan kriteria dalam masing-masing data
        const countB7 = data[0] === criteria ? 1 : 0;
        const countC7 = data[1] === criteria ? 1 : 0;
        const countD7 = data[2] === criteria ? 1 : 0;

        // Perhitungan sesuai dengan rumus Excel
        const result = (countB7 * 100) + (countC7 * 75) + (countD7 * 50);

        return result;
    }
}
