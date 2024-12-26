import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';

@Injectable()
export class FieldWorkQuery extends DbService {
    async findById(id: string) {
        return await this.prisma.fieldWork.findUnique({
            where: {
                id,
            },
        });
    }

    async findAll() {
        return await this.prisma.fieldWork.findMany()
    }
}