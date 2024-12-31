import { Mbti } from "@prisma/client";

export type IUpdateMbti = Partial<Pick<Mbti, 'naration'>>;
