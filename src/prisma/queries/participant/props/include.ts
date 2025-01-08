import { Prisma } from "@prisma/client";


export const getIncludePropFindManyPaginate = () => {
    const include: Prisma.ParticipantInclude = {
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

    return { include };
}