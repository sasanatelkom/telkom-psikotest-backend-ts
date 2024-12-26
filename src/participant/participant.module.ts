import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ParticipantService } from './participant.service';
import { ParticipantRepository } from './participant.repository';
import { ParticipantController } from './participant.controller';
import { HelperModule } from '../helpers/helper.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FieldWorkModule } from '../field-work/field-work.module';

@Module({
    imports: [
        PrismaModule,
        HelperModule,
        JwtModule.register({}),
        forwardRef(() => AuthModule),
        FieldWorkModule
    ],
    providers: [ParticipantService, ParticipantRepository],
    controllers: [ParticipantController],
    exports: [ParticipantService, ParticipantRepository],
})
export class ParticipantModule { }
