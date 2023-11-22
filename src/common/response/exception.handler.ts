import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FailedResponse } from './response';
import { Exception, ExceptionCode } from './exception';

@Catch(HttpException)
export class ExceptionHandler implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const statusCode = exception.getStatus();
    exception.code = exception.code || ExceptionCode.UNDEFINED;
    if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(`[${exception}]
${exception.stack || ''}`);
    }

    response.status(statusCode).json(FailedResponse(exception));
  }
}
