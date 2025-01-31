import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entity/account.entity';
import { TokenGuard } from './guard/token.guard';
import { CurrentUser } from './decorator/user.decorator';

@Controller('account')
@UseGuards(TokenGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAccount(@CurrentUser() user: Account) {
    return user;
  }

  @Patch('/timetable')
  async patchTimetable(
    @CurrentUser() user: Account,
    @Body()
    body: {
      timetable: string;
    },
  ) {
    return await this.accountService.patchTimetable(user.email, body.timetable);
  }

  @Patch('/calculator')
  async patchCalculator(
    @CurrentUser() user: Account,
    @Body()
    body: {
      timetable: string;
    },
  ) {
    return await this.accountService.patchCalculatorTimetable(
      user.email,
      body.timetable,
    );
  }

  @Patch('/student-id')
  async updateStudentId(
    @CurrentUser() user: Account,
    @Body() body: { studentId: string; password: string },
  ) {
    return await this.accountService.updateStudentId(
      user.email,
      body.studentId,
      body.password,
    );
  }

  @Delete('/logout')
  async logout(@Req() request: Request) {
    const accessToken = request.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
      throw new HttpException({}, HttpStatus.UNAUTHORIZED);
    }
    return await this.accountService.logout(accessToken);
  }
}
