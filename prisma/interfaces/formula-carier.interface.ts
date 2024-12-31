import { TypeOrientation } from "@prisma/client";

export interface IFormulaCarier {
    orientation: TypeOrientation;
    cluster1: string;
    cluster2: string;
    cluster3: string;
    codeSDS: string;
    code1: string;
    code2: string;
    program: string;
}

export interface IFormulaOrientation {
    category: String,
    persentage: number
}
