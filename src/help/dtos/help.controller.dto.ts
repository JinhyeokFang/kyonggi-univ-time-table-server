import { IsString } from 'class-validator';

export class AddHelpDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;
}