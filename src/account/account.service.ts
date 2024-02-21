import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { Repository } from 'typeorm';
import { TempToken } from './entity/temp-token.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class AccountService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(TempToken)
    private readonly tempTokenRepository: Repository<TempToken>,
  ) {}

  async googleLogin(req) {
    if (!req.user) {
      throw new HttpException({}, HttpStatus.UNAUTHORIZED);
    }

    const refreshToken = await this.jwtService.sign(req.user, {
      expiresIn: '14d',
    });
    const tempToken = TempToken.of(randomUUID(), refreshToken, new Date());
    this.tempTokenRepository.save(tempToken);
    return tempToken;
  }

  async getRefreshToken(tempTokenString: string) {
    const tempToken = await this.tempTokenRepository.findOne({
      where: {
        randomString: tempTokenString,
      },
    });
    console.log(tempToken.created.getTime() + 60000, new Date().getTime());
    if (
      tempToken != null &&
      tempToken.created.getTime() + 3600000 > new Date().getTime()
    ) {
      await this.tempTokenRepository.remove([tempToken]);
      return tempToken.refreshToken;
    }
    return '';
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
