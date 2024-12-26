import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MomentModule } from '@ccmos/nestjs-moment';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { MajorService } from './major.service';
import { MajorRepository } from './major.repository';
import { MajorController } from './major.controller';
import { HelperModule } from '../helpers/helper.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({}),
        MomentModule,
        ConfigModule,
        HelperModule,
        forwardRef(() => AuthModule),
    ],
    providers: [MajorService, MajorRepository],
    controllers: [MajorController],
    exports: [MajorService, MajorRepository],
})
export class MajorModule { }