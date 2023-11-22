import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/domain/user.entity';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { jwtModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), jwtModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
