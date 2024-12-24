import { Injectable } from '@nestjs/common';
import { IUpdateMajor } from 'src/major/interfaces/major.interface';
import { MajorQuery } from 'src/prisma/queries/major/major.query';
import { CustomError } from 'utils/error/custom-error';

@Injectable()
export class MajorRepository {
    constructor(
        private readonly majorQuery: MajorQuery
    ) { }

    async getThrowMajorById(id: string) {
        const major = await this.majorQuery.findById(id);
        if (!major) {
            throw new CustomError('Jurusan tidak ditemukan', 404);
        }
        return major;
    }

    async getAllMajors() {
        return await this.majorQuery.findAll();
    }

    async updateMajor(id: string, data: IUpdateMajor) {
        await this.getThrowMajorById(id);
        return await this.majorQuery.update(id, data);
    }

    async deleteMajor(id: string) {
        await this.getThrowMajorById(id);
        return await this.majorQuery.delete(id);
    }
}
