import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('google')
export class GoogleController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  googleLoginPage() {
    return;
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async generateRefreshToken(@Req() req, @Res({ passthrough: true }) response) {
    const tempToken = await this.accountService.googleLogin(req);
    response.redirect(
      'https://kyonggiti.me?tempToken=' + tempToken.randomString,
    );
  }

  @Get('refresh')
  async getRefreshToken(@Req() req, @Res({ passthrough: true }) response) {
    const tempToken = req.headers['authorization'].split(' ')[1];
    const refreshToken = await this.accountService.getRefreshToken(tempToken);
    response.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secret: true,
      expires: new Date(Date.now() + 14 * 24 * 3600000),
    });
  }

  @Get('access')
  async getAccessToken(@Req() req) {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) {
      throw new HttpException({}, HttpStatus.UNAUTHORIZED);
    }
    const accessToken = await this.accountService.getAccessToken(refreshToken);
    return {
      accessToken,
    };
  }
}
