import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PayloadToken } from './type';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from 'src/user/user.repository';
import { CustomError } from 'utils/error/custom-error';
@Injectable()
export class AuthRepository {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
        private readonly userRepository: UserRepository
    ) { }

    /*
      |--------------------------------------------------------------------------
      | Auth user function
      |--------------------------------------------------------------------------
      */
    async login(dto: LoginUserDto) {
        try {
            const user = await this.userRepository.getThrowUserByUsername(dto.username);

            const validPassword = await bcrypt.compare(dto.password, user.password);

            if (!validPassword) {
                throw new CustomError('Password salah', 400);
            }

            return await this.signJwtToken(
                user.id,
                user.role,
                '7d',
            );
        } catch (error) {
            throw error;
        }
    }

    /*
      |--------------------------------------------------------------------------
      | Auth participant function
      |--------------------------------------------------------------------------
      */

    /*
      |--------------------------------------------------------------------------
      | Helper auth function
      |--------------------------------------------------------------------------
      */

    private async signJwtToken(
        idUser: string,
        role: string,
        expire: string,
    ): Promise<{ access_token: string }> {
        //  payload user data for jwt token
        const payload: PayloadToken = {
            sub: idUser,
            role: role,
            expire: expire,
        };

        // create token with data payload
        const token = await this.jwt.signAsync(payload, {
            expiresIn: expire,
            secret: this.config.get('JWT_SECRET'),
        });

        return { access_token: token };
    }

    async decodeJwtToken(accessToken: string) {
        const decodedJwt = this.jwt.decode(
            accessToken.split(' ')[1],
        ) as PayloadToken;
        return decodedJwt;
    }

    async refreshJwtToken(accessToken: string) {
        const decodedJwt = await this.decodeJwtToken(accessToken);
        // check valid token
        if (!decodedJwt) {
            throw new CustomError('Invalid token', 401);
        }

        await this.userRepository.getThrowUserById(decodedJwt.sub);
        return this.signJwtToken(
            decodedJwt.sub,
            decodedJwt.role,
            '7d',
        );
    }
}
