import { Service, EventStore, Result } from '@app/core';
import { CreateCourseResponse } from './types';
import { IdGenerator } from '@app/core/application/id/id-generator.interface';
import { CreateCourseCommand } from './types/command.type';
import {
  CourseDescription,
  CourseDuration,
  CourseId,
  CourseImage,
  CourseLevel,
  CourseName,
  CourseTag,
} from '../../../domain/value-objects';
import { CategoryId } from 'apps/api/src/category/domain/value-objects/category-id';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';
import { Course, Lesson } from '../../../domain';
import {
  LessonDescription,
  LessonId,
  LessonTitle,
  LessonVideo,
} from '../../../domain/entities/lessons/value-objects';

export class CreateCourseCommandHandler
  implements Service<CreateCourseCommand, CreateCourseResponse>
{
  constructor(
    private readonly idGenerator: IdGenerator<string>,
    private readonly eventStore: EventStore,
  ) {}

  async execute(
    command: CreateCourseCommand,
  ): Promise<Result<CreateCourseResponse>> {
    const id = this.idGenerator.generateId();
    const data = {
      name: new CourseName(command.name),
      description: new CourseDescription(command.description),
      level: new CourseLevel(command.level),
      tags: command.tags.map((tag) => new CourseTag(tag)),
      duration: new CourseDuration(command.weeks, command.minutes),
      image: new CourseImage(command.image),
      category: new CategoryId(command.categoryId),
      instructor: new InstructorId(command.instructorId),
      lessons: command.lessons.map(
        (lesson) =>
          new Lesson(
            new LessonId(this.idGenerator.generateId()),
            new LessonTitle(lesson.title),
            new LessonDescription(lesson.description),
            new LessonVideo(lesson.video),
          ),
      ),
    };
    const course = Course.create(new CourseId(id), data);
    const events = course.pullEvents();
    await this.eventStore.appendEvents(id, events);
    return Result.success<CreateCourseResponse>({
      id,
    });
  }
}
