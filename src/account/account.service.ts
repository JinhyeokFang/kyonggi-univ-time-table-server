import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { Repository } from 'typeorm';
import { TempToken } from './entity/temp-token.entity';
import { randomUUID } from 'crypto';
import axios from 'axios';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cacheable } from 'cacheable';

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
    @Inject(CACHE_MANAGER) private cacheManager: Cacheable,
  ) {}

 async googleLogin(req) {
   if (!req.user) {
     throw new HttpException({}, HttpStatus.UNAUTHORIZED);
   }

   try {
     const refreshToken = await this.jwtService.sign(req.user, {
       expiresIn: '14d',
     });
     const tempToken = TempToken.of(randomUUID(), refreshToken, new Date());
     await this.tempTokenRepository.save(tempToken);
     return tempToken;
   } catch (err) {
     throw new HttpException(
       '로그인 처리 중 오류가 발생했습니다',
       HttpStatus.INTERNAL_SERVER_ERROR,
     );
   }
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
         expiresIn: '10m',
       },
     );
     return accessToken;
   }
   return '';
 }

 async logout(accessToken: string) {
   try {
     const decoded = await this.jwtService.verifyAsync(accessToken);
     const timeToExpire = (decoded.exp * 1000) - Date.now();
     
     if (timeToExpire > 0) {
       await this.cacheManager.set(
         `blacklist:${accessToken}`,
         'true',
         timeToExpire
       );
     }
     
     return { success: true, message: '로그아웃되었습니다' };
   } catch (error) {
     throw new HttpException(
       '유효하지 않은 토큰입니다',
       HttpStatus.UNAUTHORIZED
     );
   }
 }

 async validateToken(accessToken: string) {
   try {
     const isBlacklisted = await this.cacheManager.get(`blacklist:${accessToken}`);
     if (isBlacklisted) {
       throw new HttpException({}, HttpStatus.UNAUTHORIZED);
     }

     const decoded = await this.jwtService.verifyAsync(accessToken);
     const user = await this.accountRepository.findOne({
       where: { email: decoded.email },
     });

     if (!user) {
       throw new HttpException({}, HttpStatus.UNAUTHORIZED);
     }

     return user;
   } catch (error) {
     throw new HttpException({}, HttpStatus.UNAUTHORIZED);
   }
 }

 async patchTimetable(email: string, timetable: string) {
   const accountEntity = await this.accountRepository.update(
     { email },
     {
       savedTimetable: timetable,
     },
   );
   return accountEntity;
 }

 async patchCalculatorTimetable(email: string, timetable: string) {
   const accountEntity = await this.accountRepository.update(
     { email },
     {
       savedCalculatorTimetable: timetable,
     },
   );
   return accountEntity;
 }

 async updateStudentId(
   email: string,
   studentId: string,
   password: string,
 ) {
   try {
     const loginFormData = new URLSearchParams();
     loginFormData.append('username', '');
     loginFormData.append('password', '');
     loginFormData.append('id', studentId);
     loginFormData.append('pw', password);
     loginFormData.append('idChk2', 'on');

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

     const isLoginSuccessful =
       loginResponse.status === 302 ||
       loginResponse.headers['location']?.includes('sso/pmi-sso.jsp');

     if (isLoginSuccessful) {
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
     throw new HttpException(
       '로그인 처리 중 오류 발생',
       HttpStatus.INTERNAL_SERVER_ERROR,
     );
   }
 }
}
