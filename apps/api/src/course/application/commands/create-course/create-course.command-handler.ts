import {
  ApplicationService,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { CreateCourseResponse } from './types';
import { IdGenerator } from '@app/core/application/id/id-generator.interface';
import { CreateCourseCommand } from './types/command.type';
import {
  CourseDescription,
  CourseId,
  CourseImage,
  CourseLevel,
  CourseMinute,
  CourseName,
  CourseTag,
  CourseWeek,
} from '../../../domain/value-objects';
import { CategoryId } from 'apps/api/src/category/domain/value-objects/category-id';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';
import { Course } from '../../../domain';

export class CreateCourseCommandHandler
  implements ApplicationService<CreateCourseCommand, CreateCourseResponse>
{
  constructor(
    private readonly idGenerator: IdGenerator<string>,
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
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
      weeks: new CourseWeek(command.weeks),
      minutes: new CourseMinute(command.minutes),
      image: new CourseImage(command.image),
      category: new CategoryId(command.categoryId),
      instructor: new InstructorId(command.instructorId),
    };
    const course = Course.create(new CourseId(id), data);
    const events = course.pullEvents();
    await this.eventStore.appendEvents(id, events);
    this.eventHandler.publishEvents(events);
    return Result.success<CreateCourseResponse>({
      id,
    });
  }
}
