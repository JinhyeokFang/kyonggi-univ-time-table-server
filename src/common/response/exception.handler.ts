import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
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
    console.dir(exception);

    response.status(statusCode).json(FailedResponse(exception));
  }
}
