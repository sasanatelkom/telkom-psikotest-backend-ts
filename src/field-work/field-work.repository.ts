import { Injectable } from '@nestjs/common';
import { FieldWorkQuery } from '../prisma/queries/field-work/field-work.query';
import { CustomError } from '../utils/error/custom-error';
import { FieldWork } from '@prisma/client';

@Injectable()
export class FieldWorkRepository {
    constructor(private readonly fieldWorkQuery: FieldWorkQuery) { }

    async getThrowFieldWorkById(id: string): Promise<FieldWork> {
        const fieldWork = await this.fieldWorkQuery.findById(id);
        if (!fieldWork) {
            throw new CustomError(`Bidang Pekerjaan dengan ID ${id} tidak ditemukan`, 404);
        }
        return fieldWork;
    }

    async getAllFieldWorks(): Promise<FieldWork[]> {
        return await this.fieldWorkQuery.findAll();
    }

    async checkAllFieldWorksExist(ids: string[]): Promise<boolean> {
        const allExist = await this.fieldWorkQuery.checkAllIdsExist(ids);
        if (!allExist) {
            throw new CustomError('Beberapa ID Bidang Pekerjaan tidak ditemukan', 404);
        }
        return true;
    }
}
