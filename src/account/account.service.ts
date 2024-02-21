import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async googleLogin(req) {
    if (!req.user) {
      return '';
    }

    const refreshToken = await this.jwtService.sign(req.user, {
      expiresIn: '14d',
    });
    return refreshToken;
  }

  async getAccessToken(refreshToken: string) {
    const isValid = await this.jwtService.verifyAsync(refreshToken);
    if (isValid) {
      const accessToken = await this.jwtService.signAsync(
        {
          email: isValid.email,
        },
        {
          expiresIn: '14d',
        },
      );
      return accessToken;
    }
    return '';
  }

  async getAccount(accessToken: string) {
    const result = await this.jwtService.verifyAsync(accessToken);
    const accountEntity = await this.accountRepository.findOne({
      where: {
        email: result.email,
      },
    });
    return accountEntity;
  }

  async patchTimetable(accessToken: string, timetable: string) {
    const result = await this.jwtService.verifyAsync(accessToken);
    const accountEntity = await this.accountRepository.update(
      {
        email: result.email,
      },
      {
        savedTimetable: timetable,
      },
    );
    return accountEntity;
  }

  async patchCalculatorTimetable(accessToken: string, timetable: string) {
    const result = await this.jwtService.verifyAsync(accessToken);
    const accountEntity = await this.accountRepository.update(
      {
        email: result.email,
      },
      {
        savedCalculatorTimetable: timetable,
      },
    );
    return accountEntity;
  }
}
