import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Evaluation } from './entity/evaluation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as EvaluationServiceDTO from './dtos/evaluation.service.dto';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
  ) {}

  async createEvaluation(dto: EvaluationServiceDTO.createEvaluationDTO) {
    const isEvaluationExists = await this.evaluationRepository.exist({
      where: {
        nameOfLecture: dto.nameOfLecture,
        nameOfProfessor: dto.nameOfProfessor,
        authorEmail: dto.authorEmail,
      },
    });
    if (isEvaluationExists) {
      throw new HttpException(
        {
          message: '이미 평가한 강의입니다.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const evaluation = Evaluation.of({
      authorEmail: dto.authorEmail,
      nameOfLecture: dto.nameOfLecture,
      nameOfProfessor: dto.nameOfProfessor,
      totalRate: dto.totalRate,
    });
    await this.evaluationRepository.save(evaluation);
  }

  async getEvaluations(nameOfLecture: string, nameOfProfessor: string) {
    const evaluations = await this.evaluationRepository.find({
      where: {
        nameOfLecture: Like(`%${nameOfLecture}%`),
        nameOfProfessor: Like(`%${nameOfProfessor}%`),
      },
      take: 100,
    });
    return evaluations;
  }
}
