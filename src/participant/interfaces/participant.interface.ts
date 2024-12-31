import { Participant } from "@prisma/client";

export type ICreateParticipant = Pick<
    Participant,
    'name' | 'email' | 'phoneNumber' | 'schoolName' | 'class' | 'orientation'
> & Partial<Pick<
    Participant,
    'codeSds' | 'codeSds1' | 'codeSds2' | 'mbti' | 'mbtiNaration' | 'suggestPrograms'
>> & {
    participantOnFieldWork: {
        create: { idFieldWork: string; index: number }[];
    };
    participantOnProfessionQuestion: {
        create: {
            nameProfession: string;
            codeProfession: string;
            timeTrack: number; // mili seconds
            idProfessionQuestion: string;
        }[];
    };
    participantOnPersonalityQuestion: {
        create: {
            opsi: string;
            code: string;
            groupCodeQuestion: string;
            idPersonalityQuestion: string;
        }[];
    };
};
