import {
  ApplicationService,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { UpdateCourseCommand, UpdateCourseResponse } from './types';
import { CourseNotFoundException } from '../../exceptions';
import { Course } from '../../../domain';
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

export class UpdateCourseCommandHandler
  implements ApplicationService<UpdateCourseCommand, UpdateCourseResponse>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: UpdateCourseCommand,
  ): Promise<Result<UpdateCourseResponse>> {
    const events = await this.eventStore.getEventsByStream(command.id);
    if (events.length === 0) throw new CourseNotFoundException();
    const course = Course.loadFromHistory(new CourseId(command.id), events);
    if (command.name) course.updateName(new CourseName(command.name));
    if (command.description)
      course.updateDescription(new CourseDescription(command.description));
    if (command.level) course.updateLevel(new CourseLevel(command.level));
    if (command.tags)
      course.updateTags(command.tags.map((tag) => new CourseTag(tag)));
    if (command.duration) {
      course.updateDuration(
        new CourseDuration(command.duration.weeks, command.duration.minutes),
      );
    }
    if (command.image) course.updateImages(new CourseImage(command.image));
    if (command.categoryId)
      course.updateCategory(new CategoryId(command.categoryId));
    const newEvents = course.pullEvents();
    await this.eventStore.appendEvents(command.id, newEvents);
    this.eventHandler.publishEvents(newEvents);
    return Result.success<UpdateCourseResponse>({
      id: command.id,
    });
  }
}
