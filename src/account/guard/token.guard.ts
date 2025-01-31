import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AccountService } from '../account.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private accountService: AccountService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      return false;
    }

    const user = await this.accountService.validateToken(accessToken);
    if (user) {
      request.user = user;
      return true;
    }
    return false;
  }
}
