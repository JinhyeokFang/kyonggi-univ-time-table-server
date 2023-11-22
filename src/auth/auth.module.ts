import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/domain/user.entity';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JWTModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JWTModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
