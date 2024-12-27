import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MomentModule } from '@ccmos/nestjs-moment';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { HelperModule } from '../helpers/helper.module';
import { AuthModule } from '../auth/auth.module';
import { ProfessionQuestionService } from '../profession-question/profession-question.service';
import { ProfessionQuestionRepository } from '../profession-question/profession-question.repository';
import { ProfessionQuestionController } from '../profession-question/profession-question.controller';

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
        ProfessionQuestionService,
        ProfessionQuestionRepository,
    ],
    controllers: [ProfessionQuestionController],
    exports: [ProfessionQuestionService, ProfessionQuestionRepository],
})
export class ProfessionQuestionModule { }
