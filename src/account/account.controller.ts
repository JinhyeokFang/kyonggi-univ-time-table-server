import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAccount(@Req() request: Request) {
    const accountEntity = await this.accountService.getAccount(
      request.headers['authorization'].split(' ')[1],
    );
    return accountEntity;
  }

  @Patch('/timetable')
  async patchTimetable(
    @Req() request: Request,
    @Body()
    body: {
      timetable: string;
    },
  ) {
    await this.accountService.patchTimetable(
      request.headers['authorization'].split(' ')[1],
      body.timetable,
    );
  }

  @Patch('/calculator')
  async patchCalculator(
    @Req() request: Request,
    @Body()
    body: {
      timetable: string;
    },
  ) {
    await this.accountService.patchCalculatorTimetable(
      request.headers['authorization'].split(' ')[1],
      body.timetable,
    );
  }

  @Patch('/student-id')
  async updateStudentId(
    @Req() request: Request,
    @Body() body: { studentId: string; password: string },
  ) {
    return await this.accountService.updateStudentId(
      request.headers['authorization'].split(' ')[1],
      body.studentId,
      body.password,
    );
  }
}
