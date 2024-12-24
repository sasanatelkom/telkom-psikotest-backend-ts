import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository
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


}
