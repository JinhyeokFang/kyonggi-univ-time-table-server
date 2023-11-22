import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtProvider } from './jwt.provider';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtProvider, JwtStrategy],
  exports: [JwtProvider, JwtStrategy],
})
export class JWTModule {}
