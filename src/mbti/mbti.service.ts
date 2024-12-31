import { Injectable } from '@nestjs/common';
import { MbtiRepository } from './mbti.repository';
import { IUpdateMbti } from './interfaces/mbti.interface';

@Injectable()
export class MbtiService {
    constructor(
        private readonly mbtiRepository: MbtiRepository
    ) { }

    async getMbtiById(id: string) {
        return await this.mbtiRepository.getThrowMbtiById(id);
    }

    async getAllMbtis() {
        return await this.mbtiRepository.getAllMbtis();
    }

    async updateMbti(id: string, data: IUpdateMbti) {
        return await this.mbtiRepository.updateMbti(id, data);
    }
}
