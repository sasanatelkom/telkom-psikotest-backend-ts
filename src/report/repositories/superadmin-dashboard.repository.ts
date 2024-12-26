import { Injectable } from '@nestjs/common';
import { ReportQuery } from '../../prisma/queries/report/report.query';

@Injectable()
export class ReportSuperadminDashboardRepository {
    constructor(
        private readonly reportQuery: ReportQuery
    ) { }

    async getDashboardAdmin() {
        return await this.reportQuery.getDashboardAdmin();
    }
}
