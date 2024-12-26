import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MomentModule } from '@ccmos/nestjs-moment';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { FieldWorkService } from './field-work.service';
import { FieldWorkRepository } from './field-work.repository';
import { FieldWorkController } from './field-work.controller';
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
    providers: [FieldWorkService, FieldWorkRepository],
    controllers: [FieldWorkController],
    exports: [FieldWorkService, FieldWorkRepository],
})
export class FieldWorkModule { }
