import { Controller, Get, Query } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { ResponseBody, SuccessResponse } from '../common/response/response';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  async getLectures(
    @Query('name') name?: string,
    @Query('professor') professor?: string,
    @Query('major') major?: string,
    @Query('campusName') campusName?: string,
    @Query('category') category?: string,
    @Query('group') group?: string,
    @Query('lectureNumber') lectureNumber?: string,
    @Query('grade') grade?: string,
  ): Promise<ResponseBody> {
    const lectures = await this.lectureService.getLectures({
      name,
      professor,
      major,
      campusName,
      category,
      group,
      lectureNumber: lectureNumber ? parseInt(lectureNumber) : undefined,
      grade: grade ? parseInt(grade) : undefined,
    });
    return SuccessResponse({
      lectures,
    });
  }
}
