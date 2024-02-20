import { Module } from '@nestjs/common';
import { HelpService } from './help.service';
import { HelpController } from './help.controller';
import { Help } from './entity/help.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Help])],
  providers: [HelpService],
  controllers: [HelpController],
})
export class HelpModule {}
