import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Help } from './entity/help.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(Help)
    private readonly helpRepository: Repository<Help>,
  ) {}

  async addHelp(title: string, description: string) {
    const help = Help.of(title, description);
    this.helpRepository.save(help);
  }
}
