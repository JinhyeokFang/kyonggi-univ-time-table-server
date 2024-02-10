import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
export class Lecture {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  professor!: string;

  @Column()
  @IsString()
  name!: string;

  @Column()
  @IsString()
  campusName!: string;

  @Column()
  lectureNumber!: number;

  @Column()
  grade!: number;

  @Column()
  @IsString()
  room!: string;

  @Column()
  @IsString()
  time!: string;

  @Column()
  year!: number;

  @Column()
  @IsString()
  semester!: string;

  @Column()
  credit!: number;

  @Column()
  @IsString()
  category!: string;

  @Column()
  @IsString()
  group!: string;

  @Column()
  major!: string;
}
