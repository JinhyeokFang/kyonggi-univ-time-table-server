import { IsString } from 'class-validator';

export class LoginBody {
  @IsString()
  id: string;

  @IsString()
  password: string;
}

export class RegisterBody {
  @IsString()
  id: string;

  @IsString()
  password: string;
}
