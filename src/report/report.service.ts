import { Injectable } from '@nestjs/common';
import { ReportSuperadminDashboardRepository } from './repositories/superadmin-dashboard.repository';

@Injectable()
export class ReportService {
    constructor(
        private readonly reportSuperadminDashboardRepository: ReportSuperadminDashboardRepository
    ) { }

    async getDashboardAdmin() {
        return await this.reportSuperadminDashboardRepository.getDashboardAdmin();
    }
}
