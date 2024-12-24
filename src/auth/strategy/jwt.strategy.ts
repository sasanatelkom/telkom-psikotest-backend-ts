import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from './../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // check token for user
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (user) return true;

    // check token for participant
    const participant = await this.prisma.participant.findUnique({
      where: {
        id: payload.sub
      }
    })

    if (participant) return true

    return false;
  }
}
