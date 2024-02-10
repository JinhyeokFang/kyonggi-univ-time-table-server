import { Controller, Get } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { ResponseBody, SuccessResponse } from '../common/response/response';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  async getLectures(): Promise<ResponseBody> {
    const lectures = await this.lectureService.getLectures({});
    return SuccessResponse({
      lectures,
    });
  }
}
