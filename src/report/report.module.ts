import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MomentModule } from '@ccmos/nestjs-moment';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { HelperModule } from '../helpers/helper.module';
import { AuthModule } from '../auth/auth.module';
import { ReportSuperadminDashboardRepository } from './repositories/superadmin-dashboard.repository';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({}),
        MomentModule,
        ConfigModule,
        HelperModule,
        forwardRef(() => AuthModule),
    ],
    providers: [ReportService, ReportSuperadminDashboardRepository],
    controllers: [ReportController],
    exports: [ReportService, ReportSuperadminDashboardRepository],
})
export class ReportModule { }