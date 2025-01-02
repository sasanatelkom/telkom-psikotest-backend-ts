import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ParticipantService } from './participant.service';
import { ParticipantRepository } from './participant.repository';
import { ParticipantController } from './participant.controller';
import { HelperModule } from '../helpers/helper.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FieldWorkModule } from '../field-work/field-work.module';
import { MbtiModule } from '../mbti/mbti.module';
import { MajorModule } from '../major/major.module';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [
        PrismaModule,
        HelperModule,
        JwtModule.register({}),
        forwardRef(() => AuthModule),
        FieldWorkModule,
        MbtiModule,
        MajorModule,
        MailModule
    ],
    providers: [ParticipantService, ParticipantRepository],
    controllers: [ParticipantController],
    exports: [ParticipantService, ParticipantRepository],
})
export class ParticipantModule { }
