import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import * as EvaluationControllerDTO from './dtos/evaludation.controller.dto';
import { AccountService } from 'src/account/account.service';

@Controller('evaluation')
export class EvaluationController {
  constructor(
    private readonly evaluationService: EvaluationService,
    private readonly accountService: AccountService,
  ) {}

  @Post()
  async createEvaluation(
    @Body() body: EvaluationControllerDTO.createEvaludationResponseDTO,
    @Req() request: Request,
  ) {
    const accountEntity = await this.accountService.getAccount(
      request.headers['authorization'].split(' ')[1],
    );
    await this.evaluationService.createEvaluation({
      nameOfLecture: body.nameOfLecture,
      nameOfProfessor: body.nameOfProfessor,
      totalRate: body.totalRate,
      assignmentRate: body.assignmentRate,
      markRate: body.markRate,
      authorEmail: accountEntity.email,
    });
  }

  @Get('/:lecture/:professor')
  async getEvaluations(
    @Param('lecture') lecture: string,
    @Param('professor') professor: string,
  ) {
    const evaluations = await this.evaluationService.getEvaluations(
      lecture,
      professor,
    );

    const data: EvaluationControllerDTO.getEvaludationResponseDTO[] =
      evaluations.map((entity) => ({
        nameOfLecture: entity.nameOfLecture,
        nameOfProfessor: entity.nameOfProfessor,
        totalRate: entity.totalRate,
        assignmentRate: entity.assignmentRate,
        markRate: entity.markRate,
      }));

    return {
      evaluations: data,
    };
  }
}
