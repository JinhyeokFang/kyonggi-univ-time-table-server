import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class JwtGuard extends AuthGuard('jwt') {}

export const UseJwtGuard = () => UseGuards(JwtGuard);
