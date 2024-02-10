import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { Repository } from 'typeorm';
import * as LectureServiceDTO from './dtos/lecture.service.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
  ) {}

  async getLectures(dto: LectureServiceDTO.getLecturesDTO) {
    const lectures = await this.lectureRepository.find({
      where: {
        name: dto.name,
        professor: dto.professor,
        campusName: dto.campusName,
        lectureNumber: dto.lectureNumber,
        grade: dto.grade,
        room: dto.room,
        time: dto.time,
        year: dto.year,
        semester: dto.semester,
        credit: dto.credit,
        category: dto.category,
        group: dto.group,
        major: dto.major,
      },
    });
    return lectures;
  }
}
