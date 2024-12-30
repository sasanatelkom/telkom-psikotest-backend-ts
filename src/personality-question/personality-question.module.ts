import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MomentModule } from '@ccmos/nestjs-moment';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { HelperModule } from '../helpers/helper.module';
import { AuthModule } from '../auth/auth.module';
import { PersonalityQuestionService } from '../personality-question/personality-question.service';
import { PersonalityQuestionRepository } from '../personality-question/personality-question.repository';
import { PersonalityQuestionController } from '../personality-question/personality-question.controller';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({}),
        MomentModule,
        ConfigModule,
        HelperModule,
        forwardRef(() => AuthModule),
    ],
    providers: [
        PersonalityQuestionService,
        PersonalityQuestionRepository,
    ],
    controllers: [PersonalityQuestionController],
    exports: [PersonalityQuestionService, PersonalityQuestionRepository],
})
export class PersonalityQuestionModule { }
