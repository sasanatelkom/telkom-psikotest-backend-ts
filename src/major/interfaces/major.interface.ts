import { Major } from "@prisma/client";

export type IUpdateMajor = Partial<Pick<Major, 'url'>>;
