import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
export class Help {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  title!: string;

  @Column()
  @IsString()
  description!: string;

  static of(title: string, description: string): Help {
    const help = new Help();
    help.title = title;
    help.description = description;
    return help;
  }
}
