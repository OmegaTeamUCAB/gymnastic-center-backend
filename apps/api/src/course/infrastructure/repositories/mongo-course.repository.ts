import { InjectModel } from '@nestjs/mongoose';
import { MongoCourse, Optional } from '@app/core';
import { Model } from 'mongoose';
import { CourseRepository } from '../../application/repositories/course.repository';
import { Course } from '../../application/models/course.model';

export class MongoCourseRepository implements CourseRepository {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
  ) {}

  async findCourseById(courseId: string): Promise<Optional<Course>> {
    const course = await this.courseModel.findOne({ id: courseId });

    return course
      ? Optional.of({
          id: course.id,
          title: course.title,
          description: course.description,
          level: course.level,
          tags: course.tags,
          weeks: course.weeks,
          minutes: course.minutes,
          image: course.image,
          publishDate: course.publishDate,
          views: course.views,
          trainer: {
            id: course.trainer.id,
            name: course.trainer.name,
            image: course.trainer.image,
          },
          category: { id: course.category.id, name: course.category.name },
          lessons: course.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            video: lesson.video,
          })),
        })
      : Optional.empty();
  }
}
