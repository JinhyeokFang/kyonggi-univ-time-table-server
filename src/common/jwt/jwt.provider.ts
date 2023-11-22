import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtProvider {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(userId: string): Promise<string> {
    const token = await this.jwtService.signAsync({
      userId,
    });

    return token;
  }
}
