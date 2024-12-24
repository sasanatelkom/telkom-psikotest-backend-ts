import { Injectable } from '@nestjs/common';
import { MajorRepository } from './major.repository';
import { IUpdateMajor } from 'src/major/interfaces/major.interface';

@Injectable()
export class MajorService {
    constructor(
        private readonly majorRepository: MajorRepository
    ) { }

    async getMajorById(id: string) {
        return await this.majorRepository.getThrowMajorById(id);
    }

    async getAllMajors() {
        return await this.majorRepository.getAllMajors();
    }

    async updateMajor(id: string, data: IUpdateMajor) {
        return await this.majorRepository.updateMajor(id, data);
    }

    async deleteMajor(id: string) {
        return await this.majorRepository.deleteMajor(id);
    }
}
