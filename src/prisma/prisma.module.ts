import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './db.service';
import { UserQuery } from './queries/user/user.query';
import { MajorQuery } from './queries/major/major.query';
import { FieldWorkQuery } from './queries/field-work/field-work.query';

@Module({
  imports: [ConfigModule],
  providers: [DbService, PrismaService, UserQuery, MajorQuery, FieldWorkQuery],
  exports: [PrismaService, DbService, UserQuery, MajorQuery, FieldWorkQuery],
})
export class PrismaModule { }
