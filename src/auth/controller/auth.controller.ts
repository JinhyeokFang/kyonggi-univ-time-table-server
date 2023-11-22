import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import * as AuthBody from './auth.body';
import { ResponseBody, SuccessResponse } from 'src/common/response/response';
import { UserId } from 'src/user/controller/user.decorator';
import { UseJwtGuard } from 'src/common/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(@Body() body: AuthBody.LoginBody): Promise<ResponseBody> {
    const { id, password } = body;
    const token = await this.authService.login({
      id,
      password,
    });
    return SuccessResponse({
      token,
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  public async register(
    @Body() body: AuthBody.RegisterBody,
  ): Promise<ResponseBody> {
    const { id, password } = body;
    await this.authService.register({
      id,
      password,
    });
    return SuccessResponse(null);
  }

  @Get()
  @UseJwtGuard()
  public async test(@UserId() userId: string) {
    return userId;
  }
}
