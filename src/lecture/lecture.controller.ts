import { Body, Controller, Get } from '@nestjs/common';
import { LectureService } from './lecture.service';
import * as LectureControllerDTO from './dtos/lecture.controller.dto';
import { ResponseBody, SuccessResponse } from '../common/response/response';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  async getLectures(
    @Body() body: LectureControllerDTO.getLecturesDTO,
  ): Promise<ResponseBody> {
    const lectures = this.lectureService.getLectures(body);
    return SuccessResponse({
      lectures,
    });
  }
}
