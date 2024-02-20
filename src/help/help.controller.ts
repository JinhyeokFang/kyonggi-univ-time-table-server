import { Body, Controller, Post } from '@nestjs/common';
import { HelpService } from './help.service';
import { AddHelpDto } from './dtos/help.controller.dto';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Post('/')
  async addHelp(@Body() body: AddHelpDto) {
    this.helpService.addHelp(body.title, body.description);
  }
}
