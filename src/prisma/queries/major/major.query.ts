import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { IUpdateMajor } from '../../../major/interfaces/major.interface';

@Injectable()
export class MajorQuery extends DbService {
    async findById(id: string) {
        return await this.prisma.major.findUnique({
            where: {
                id,
            },
        });
    }

    async findAll() {
        return await this.prisma.major.findMany()
    }

    async update(id: string, data: IUpdateMajor) {
        return await this.prisma.major.update({ where: { id }, data })
    }

    async delete(id: string) {
        return await this.prisma.major.delete({ where: { id } })
    }

    async findByNames(names: string[]) {
        const conditions = names.map((name) => {
            const [degree, majorName] = name.split('-');
            return {
                degree,
                name: majorName
            };
        });

        return await this.prisma.major.findMany({
            where: {
                OR: conditions
            }
        });
    }

}