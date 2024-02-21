import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  savedTimetable!: string;

  @Column()
  @IsString()
  savedCalculatorTimetable!: string;

  @Column()
  @IsString()
  email: string;

  static of(email: string): Account {
    const account = new Account();
    account.savedTimetable = '';
    account.savedCalculatorTimetable = '';
    account.email = email;
    return account;
  }
}
