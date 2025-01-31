import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow<string>('DB_HOST'),
  port: configService.getOrThrow<number>('DB_PORT'),
  username: configService.getOrThrow<string>('DB_USER'),
  password: configService.getOrThrow<string>('DB_PASS'),
  database: configService.getOrThrow<string>('DB_NAME'),
  entities: [__dirname + '/../../**/*.entity.{js,ts}'],
  synchronize: true,
  logging: true,
  ssl: true,
});
