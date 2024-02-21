import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
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
  async getRefreshToken(@Req() req, @Res({ passthrough: true }) response) {
    const refreshToken = await this.accountService.googleLogin(req);
    response.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secret: true,
      expires: new Date(Date.now() + 14 * 24 * 3600000),
      sameSite: 'None',
    });
    response.redirect('https://kyonggiti.me');
  }

  @Get('access')
  async getAccessToken(@Req() req) {
    const refreshToken = req.cookies['refresh-token'];
    const accessToken = await this.accountService.getAccessToken(refreshToken);
    return {
      accessToken,
    };
  }
}
