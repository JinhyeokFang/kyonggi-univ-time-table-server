import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { In, Like, Repository } from 'typeorm';
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
        name: dto.name ? Like(`%${dto.name}%`) : undefined,
        professor: dto.professor ? Like(`%${dto.professor}%`) : undefined,
        campusName: dto.campusName,
        lectureNumber: dto.lectureNumber,
        grade: dto.grade,
        room: dto.room,
        time: dto.time,
        year: dto.year,
        semester: dto.semester,
        credit: dto.credit,
        category: dto.category ? Like(`%${dto.category}%`) : undefined,
        group: dto.group ? Like(`%${dto.group}%`) : undefined,
        major: dto.major ? Like(`%${dto.major}%`) : undefined,
      },
      take: 100,
    });
    return lectures;
  }

  async getLecturesWithQuery(dto: LectureServiceDTO.getLecturesWithQueryDTO) {
    const commonCondition = {
      name: dto.name ? Like(`%${dto.name}%`) : undefined,
      professor: dto.professor ? Like(`%${dto.professor}%`) : undefined,
      campusName: dto.campusName,
      lectureNumber: dto.lectureNumber,
      grade: dto.grade ? In([dto.grade, 0]) : undefined,
      room: dto.room,
      time: dto.time,
      year: dto.year,
      semester: dto.semester,
      credit: dto.credit,
      category: dto.category ? Like(`%${dto.category}%`) : undefined,
      group: dto.group ? Like(`%${dto.group}%`) : undefined,
      major: dto.major ? Like(`%${dto.major}%`) : undefined,
    };
    const condition = [
      {
        ...commonCondition,
        name: dto.name
          ? commonCondition.name
          : Like(`%${dto.query ? dto.query : ''}%`),
      },
      {
        ...commonCondition,
        professor: dto.professor
          ? commonCondition.professor
          : Like(`%${dto.query ? dto.query : ''}%`),
      },
      {
        ...commonCondition,
        group: dto.group
          ? commonCondition.group
          : Like(`%${dto.query ? dto.query : ''}%`),
      },
      {
        ...commonCondition,
        major: dto.major
          ? commonCondition.major
          : Like(`%${dto.query ? dto.query : ''}%`),
      },
    ];
    console.log(condition);
    const lectures = await this.lectureRepository.find({
      where: condition,
      take: 100,
    });
    return lectures;
  }
}
