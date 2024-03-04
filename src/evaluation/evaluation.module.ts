import { Module } from '@nestjs/common';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluation } from './entity/evaluation.entity';
import { Account } from 'src/account/entity/account.entity';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluation, Account]), AccountModule],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
