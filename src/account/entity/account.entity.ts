import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  @IsString()
  savedTimetable!: string;

  @Column('text')
  @IsString()
  savedCalculatorTimetable!: string;

  @Column()
  @IsString()
  email: string;

  @Column({ nullable: true })
  @IsString()
  studentId!: string;

  static of(email: string): Account {
    const account = new Account();
    account.savedTimetable = '';
    account.savedCalculatorTimetable = '';
    account.email = email;
    return account;
  }
}
