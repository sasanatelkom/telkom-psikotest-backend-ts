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
import { HttpHelper } from 'src/helpers/http.helper';
import { Validation } from 'src/helpers/validation.helper';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly httpHelper: HttpHelper,
    private readonly validation: Validation,
  ) { }

  /*
  |--------------------------------------------------------------------------
  | Auth Participant enpoint
  |--------------------------------------------------------------------------
  */


  /*
    |--------------------------------------------------------------------------
    | Auth User enpoint
    |--------------------------------------------------------------------------
    */
  @Post('user/login')
  async login(@Body() dto: LoginUserDto, @Res() res) {
    {
      try {
        const result = await this.authService.login(dto);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
      } catch (error) {
        this.validation.errorHandler(res, error);
      }
    }
  }


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
