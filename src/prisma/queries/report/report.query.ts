import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';

@Injectable()
export class ReportQuery extends DbService {
    async getDashboardAdmin() {
        const latestParticipants = await this.prisma.participant.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });

        const totalParticipants = await this.prisma.participant.count();

        return {
            latestParticipants,
            totalParticipants,
        };
    }
}
