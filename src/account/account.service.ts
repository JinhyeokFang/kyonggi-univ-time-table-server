import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { Repository } from 'typeorm';
import { TempToken } from './entity/temp-token.entity';
import { randomUUID } from 'crypto';
import axios from 'axios';

@Injectable()
export class AccountService {
  private readonly KUTIS_LOGIN_URL =
    'https://kutis.kyonggi.ac.kr/webkutis/view/hs/wslogin/loginCheck.jsp';

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
    await this.tempTokenRepository.save(tempToken);
    return tempToken;
  }

  async getRefreshToken(tempTokenString: string) {
    const tempToken = await this.tempTokenRepository.findOne({
      where: {
        randomString: tempTokenString,
      },
    });

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
    if (refreshToken == '') {
      throw new HttpException({}, HttpStatus.UNAUTHORIZED);
    }

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

  async updateStudentId(
    accessToken: string,
    studentId: string,
    password: string,
  ) {
    const result = await this.jwtService.verifyAsync(accessToken);
    const email = result.email;
    try {
      // FormData 생성
      const loginFormData = new URLSearchParams();
      loginFormData.append('username', ''); // 빈 값으로 설정
      loginFormData.append('password', ''); // 빈 값으로 설정
      loginFormData.append('id', studentId);
      loginFormData.append('pw', password);
      loginFormData.append('idChk2', 'on');

      // 로그인 요청
      const loginResponse = await axios.post(
        this.KUTIS_LOGIN_URL,
        loginFormData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            Referer: 'https://kutis.kyonggi.ac.kr/webkutis/view/indexWeb.jsp',
          },
          maxRedirects: 0,
          validateStatus: (status) => [200, 302].includes(status),
        },
      );

      // 로그인 성공 판단
      const isLoginSuccessful =
        loginResponse.status === 302 ||
        loginResponse.headers['location']?.includes('sso/pmi-sso.jsp');

      if (isLoginSuccessful) {
        // 계정 찾기 및 학번 업데이트
        const account = await this.accountRepository.findOne({
          where: { email },
        });

        if (account) {
          account.studentId = studentId;
          await this.accountRepository.save(account);

          return {
            success: true,
            message: 'KUTIS 로그인 성공',
          };
        }
      }

      return {
        success: false,
        message: 'KUTIS 로그인 실패',
      };
    } catch (error) {
      console.error('KUTIS 로그인 중 오류:', error);
      throw new HttpException(
        '로그인 처리 중 오류 발생',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
