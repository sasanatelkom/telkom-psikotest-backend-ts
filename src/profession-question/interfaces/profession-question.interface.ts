import { ProfessionQuestion } from "@prisma/client";

export type IUpdateProfessionQuestion = Partial<Pick<ProfessionQuestion, 'question' | 'profession1' | 'code1' | 'image1' | 'profession2' | 'code2' | 'image2'>>;
