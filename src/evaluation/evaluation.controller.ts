import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import * as EvaluationControllerDTO from './dtos/evaluation.controller.dto';
import { AccountService } from 'src/account/account.service';

@Controller('evaluation')
export class EvaluationController {
  constructor(
    private readonly evaluationService: EvaluationService,
    private readonly accountService: AccountService,
  ) {}

  @Post()
  async createEvaluation(
    @Body() body: EvaluationControllerDTO.createEvaluationResponseDTO,
    @Req() request: Request,
  ) {
    const accountEntity = await this.accountService.getAccount(
      request.headers['authorization'].split(' ')[1],
    );
    await this.evaluationService.createEvaluation({
      nameOfLecture: body.nameOfLecture,
      nameOfProfessor: body.nameOfProfessor,
      description: body.description,
      totalRate: body.totalRate,
      authorEmail: accountEntity.email,
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
