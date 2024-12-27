import { Participant } from "@prisma/client";

export type ICreateParticipant = Pick<
    Participant,
    'name' | 'email' | 'phoneNumber' | 'schoolName' | 'class' | 'orientation'
> & {
    participantOnFieldWork: {
        create: { idFieldWork: string, index: number }[];
    };
};
