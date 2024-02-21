import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import * as compression from 'compression';
import helmet from 'helmet';
import {
  BadRequestException,
  HttpStatus,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ExceptionHandler } from './common/response/exception.handler';
import { ValidationError } from 'class-validator';
import { Exception, ExceptionCode } from './common/response/exception';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT'), 10);
  Logger.debug(`Server will serviced at ${port} port`);
  let isDisableKeepAlive = false;
  app.use((req, res, next) => {
    if (isDisableKeepAlive) {
      res.set('Connection', 'close');
    }
    next();
  });
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const message = errors.map((error) => error.toString()).join();
        return new Exception(
          HttpStatus.BAD_REQUEST,
          message,
          ExceptionCode.DATA_VALIDATION_FAILED,
        );
      },
    }),
  );
  app.use(cookieParser());
  app.useGlobalFilters(new ExceptionHandler());
  app.enableCors({
    credentials: true,
    origin: '*',
  });
  process.on('SIGINT', async () => {
    isDisableKeepAlive = true;
    await app.close();
    process.exit(0);
  });
  if (process.send) {
    process.send('ready');
  }
  await app.listen(port);
  Logger.debug(`Server started`);
}
bootstrap();
