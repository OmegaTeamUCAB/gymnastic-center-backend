import { MongoCourse } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseResponse } from '../controllers/responses';
import { NotFoundException } from '@nestjs/common';
import { CourseNotFoundException } from '../../application/exceptions';

type Dto = {
  id: string;
};

export class GetCourseByIdQuery {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
  ) {}

  async execute(dto: Dto): Promise<CourseResponse> {
    const { id } = dto;
    const course = await this.courseModel.findOne({ id });
    if (!course) throw new NotFoundException(new CourseNotFoundException());
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      tags: course.tags,
      durationMinutes: course.minutes,
      durationWeeks: course.weeks,
      image: course.image,
      date: course.publishDate,
      category: course.category.name,
      trainer: {
        id: course.trainer.id,
        name: course.trainer.name,
        image: course.trainer.image,
      },
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        content: lesson.description,
        video: lesson.video,
      })),
    };
  }
}
