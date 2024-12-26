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
        return await this.prisma.fieldWork.findMany();
    }

    async checkAllIdsExist(ids: string[]): Promise<boolean> {
        const fieldWorks = await this.prisma.fieldWork.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            select: {
                id: true,
            },
        });
        return fieldWorks.length === ids.length;
    }
}
