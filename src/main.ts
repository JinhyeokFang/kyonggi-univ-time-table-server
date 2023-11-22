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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT'), 10);
  const hostname = configService.get('HOSTNAME');
  Logger.debug(`Server will serviced at ${port} port`);
  app.enableCors({
    origin: ['*'],
    exposedHeaders: ['Authorization', 'authorization'],
  });
  app.use(helmet());
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
  app.useGlobalFilters(new ExceptionHandler());
  await app.listen(port, hostname);
  Logger.debug(`Server started`);
}
bootstrap();
