import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  authorEmail: string;

  @Column()
  @IsString()
  nameOfLecture: string;

  @Column()
  @IsString()
  nameOfProfessor: string;

  @Column()
  totalRate: number;

  static of(dto: {
    authorEmail: string;
    nameOfLecture: string;
    nameOfProfessor;
    totalRate: number;
  }): Evaluation {
    const evaluation = new Evaluation();
    evaluation.authorEmail = dto.authorEmail;
    evaluation.nameOfLecture = dto.nameOfLecture;
    evaluation.nameOfProfessor = dto.nameOfProfessor;
    evaluation.totalRate = dto.totalRate;
    return evaluation;
  }
}
