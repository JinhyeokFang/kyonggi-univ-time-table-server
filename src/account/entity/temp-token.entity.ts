import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
export class TempToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  randomString!: string;

  @Column()
  @IsString()
  refreshToken!: string;

  @Column()
  @IsString()
  created!: Date;

  static of(
    randomString: string,
    refreshToken: string,
    created: Date,
  ): TempToken {
    const tempToken = new TempToken();
    tempToken.randomString = randomString;
    tempToken.refreshToken = refreshToken;
    tempToken.created = created;
    return tempToken;
  }
}
