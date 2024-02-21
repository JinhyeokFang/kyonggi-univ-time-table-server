import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { TempToken } from './entity/temp-token.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Account, TempToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AccountController, GoogleController],
  providers: [AccountService, GoogleStrategy],
})
export class AccountModule {}
