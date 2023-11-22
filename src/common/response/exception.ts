import { HttpException, HttpStatus } from '@nestjs/common';

export enum ExceptionCode {
  UNDEFINED = 'UNDEFINED',
  DATA_VALIDATION_FAILED = 'DATA_VALIDATION_FAILED',
  PAGE_NOT_FOUND = 'PAGE_NOT_FOUND',
  BAD_ID_OR_PASSWORD = 'BAD_ID_OR_PASSWORD',
  ACCOUNT_IS_EXISTS = 'ACCOUNT_IS_EXISTS',
}

export class Exception extends HttpException {
  constructor(
    status: HttpStatus,
    public message: string,
    public code: ExceptionCode = ExceptionCode.UNDEFINED,
  ) {
    super(message, status);
  }
}
