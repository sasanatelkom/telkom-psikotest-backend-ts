import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Headers,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express'
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  /*
  |--------------------------------------------------------------------------
  | Auth Participant enpoint
  |--------------------------------------------------------------------------
  */
  @Post('login')
  async login(@Body() dto: LoginUserDto, @Res() res) {
    {
      const token = await this.authService.login(dto);
      return res
        .status(HttpStatus.OK)
        .json(token);
    }
  }


  /*
    |--------------------------------------------------------------------------
    | Auth User enpoint
    |--------------------------------------------------------------------------
    */


  /*
   |--------------------------------------------------------------------------
   | Auth helper function
   |--------------------------------------------------------------------------
   */

  @UseGuards(JwtGuard)
  @Post('refresh/token')
  refreshJwtToken(@Req() req: Request) {
    return this.authService.refreshJwtToken(req.headers.authorization)
  }
}
