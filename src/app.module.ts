import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './common/config/typeorm.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { CacheModule } from '@nestjs/cache-manager';
import Keyv from 'keyv';
import { Cacheable } from 'cacheable';
import { createKeyv } from '@keyv/redis';

import { LectureModule } from './lecture/lecture.module';
import { HelpModule } from './help/help.module';
import { AccountModule } from './account/account.module';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeORMConfig(configService),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'static'),
      serveRoot: '/static',
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new Cacheable({ ttl: 60000 }),
            }),
            createKeyv(configService.getOrThrow('REDIS_URL')),
          ],
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    LectureModule,
    HelpModule,
    AccountModule,
    EvaluationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
