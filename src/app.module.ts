import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MomentModule } from '@ccmos/nestjs-moment';
import { UserModule } from './user/user.module';
import { HelperModule } from './helpers/helper.module';
import { MajorModule } from './major/major.module';
import { FieldWorkModule } from './field-work/field-work.module';
import { ParticipantModule } from './participant/participant.module';
import { ReportModule } from './report/report.module';
import { ProfessionQuestionModule } from './profession-question/profession-question.module';
import { PersonalityQuestionModule } from './personality-question/personality-question.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MomentModule.forRoot({
      tz: 'Asia/Jakarta',
    }),
    AuthModule,
    HelperModule,
    PrismaModule,
    UserModule,
    MajorModule,
    FieldWorkModule,
    ParticipantModule,
    ReportModule,
    ProfessionQuestionModule,
    PersonalityQuestionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}