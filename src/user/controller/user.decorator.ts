import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface Token {
  userId: string;
}

export const UserId = createParamDecorator(
  (_, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as Token;
    return user.userId;
  },
);
