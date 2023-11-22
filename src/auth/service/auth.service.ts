import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/domain/user.entity';
import { Repository } from 'typeorm';
import * as AuthDto from './auth.dto';
import { Exception, ExceptionCode } from 'src/common/response/exception';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async login(dto: AuthDto.LoginDto) {
    const { id, password } = dto;
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (user === null) {
      throw new Exception(
        HttpStatus.NOT_FOUND,
        '잘못된 아이디 또는 비밀번호입니다.',
        ExceptionCode.BAD_ID_OR_PASSWORD,
      );
    }

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new Exception(
        HttpStatus.NOT_FOUND,
        '잘못된 아이디 또는 비밀번호입니다.',
        ExceptionCode.BAD_ID_OR_PASSWORD,
      );
    }

    return this.createToken(user.id);
  }

  private async createToken(userId: string): Promise<string> {
    const token = await this.jwtService.signAsync({
      userId,
    });

    return token;
  }

  public async register(dto: AuthDto.RegisterDto) {
    const { id, password } = dto;
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (user !== null) {
      throw new Exception(
        HttpStatus.CONFLICT,
        '이미 존재하는 계정입니다.',
        ExceptionCode.ACCOUNT_IS_EXISTS,
      );
    }

    const newUser = new User();
    newUser.id = id;
    newUser.password = await hash(password, 10);

    await this.userRepository.save(newUser);
  }
}
