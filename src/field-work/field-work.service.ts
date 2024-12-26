import { Injectable } from '@nestjs/common';
import { FieldWorkRepository } from './field-work.repository';
import { FieldWork } from '@prisma/client';

@Injectable()
export class FieldWorkService {
    constructor(private readonly fieldWorkRepository: FieldWorkRepository) { }

    async getFieldWorkById(id: string): Promise<FieldWork> {
        return await this.fieldWorkRepository.getThrowFieldWorkById(id);
    }

    async getAllFieldWorks(): Promise<FieldWork[]> {
        return await this.fieldWorkRepository.getAllFieldWorks();
    }
}