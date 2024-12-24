import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginUserDto } from './dto/login-user.dto';
import { PayloadToken } from './type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwt: JwtService,
  ) { }

  /*
  |--------------------------------------------------------------------------
  | Auth user function
  |--------------------------------------------------------------------------
  */
  async login(dto: LoginUserDto) {
    return await this.authRepository.login(dto);
  }

  async refreshJwtToken(refreshToken: string) {
    return await this.authRepository.refreshJwtToken(refreshToken);
  }


  /*
    |--------------------------------------------------------------------------
    | Auth participant function
    |--------------------------------------------------------------------------
  */

  /*
|--------------------------------------------------------------------------
| Helper Auth
|--------------------------------------------------------------------------
*/
  async decodeJwtToken(accessToken: string) {
    const decodedJwt = this.jwt.decode(
      accessToken.split(' ')[1],
    ) as PayloadToken;
    return decodedJwt;
  }
}
