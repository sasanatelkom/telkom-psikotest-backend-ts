import { PersonalityQuestion } from "@prisma/client";

export type IUpdatePersonalityQuestion = Partial<Pick<PersonalityQuestion, 'question' | 'opsi1' | 'code1' | 'opsi2' | 'code2' | 'groupCode'>>;
