import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import * as EvaluationControllerDTO from './dtos/evaluation.controller.dto';
import { AccountService } from 'src/account/account.service';
import { TokenGuard } from 'src/account/guard/token.guard';
import { CurrentUser } from 'src/account/decorator/user.decorator';
import { Account } from 'src/account/entity/account.entity';

@Controller('evaluation')
export class EvaluationController {
  constructor(
    private readonly evaluationService: EvaluationService,
  ) {}

  @UseGuards(TokenGuard)
  @Post()
  async createEvaluation(
    @Body() body: EvaluationControllerDTO.createEvaluationResponseDTO,
    @CurrentUser() user: Account,
  ) {
    await this.evaluationService.createEvaluation({
      nameOfLecture: body.nameOfLecture,
      nameOfProfessor: body.nameOfProfessor,
      description: body.description,
      totalRate: body.totalRate,
      authorEmail: user.email,
    });
  }

  @Get()
  async getEvaluations(
    @Query('lecture') lecture: string,
    @Query('professor') professor: string,
  ) {
    const evaluations = await this.evaluationService.getEvaluations(
      lecture,
      professor,
    );

    const data: EvaluationControllerDTO.getEvaluationResponseDTO[] =
      evaluations.map((entity) => ({
        nameOfLecture: entity.nameOfLecture,
        nameOfProfessor: entity.nameOfProfessor,
        description: entity.description,
        totalRate: entity.totalRate,
      }));

    return {
      evaluations: data,
    };
  }
}
