import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MomentModule } from '@ccmos/nestjs-moment';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { MbtiService } from './mbti.service';
import { MbtiRepository } from './mbti.repository';
import { MbtiController } from './mbti.controller';
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
    providers: [MbtiService, MbtiRepository],
    controllers: [MbtiController],
    exports: [MbtiService, MbtiRepository],
})
export class MbtiModule { }