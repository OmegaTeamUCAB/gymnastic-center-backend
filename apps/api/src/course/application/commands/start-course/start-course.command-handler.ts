import { EventStore, Result, Service } from '@app/core';
import { StartCourseCommand, StartCourseResponse } from './types';
import { CourseNotFoundException } from '../../exceptions';
import { Course } from '../../../domain';
import { CourseId } from '../../../domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export class StartCourseCommandHandler
  implements Service<StartCourseCommand, StartCourseResponse>
{
  constructor(private readonly eventStore: EventStore) {}

  async execute(
    command: StartCourseCommand,
  ): Promise<Result<StartCourseResponse>> {
    const events = await this.eventStore.getEventsByStream(command.courseId);
    if (events.length === 0) throw new CourseNotFoundException();
    const course = Course.loadFromHistory(
      new CourseId(command.courseId),
      events,
    );
    course.startWatching(new UserId(command.userId));
    const newEvents = course.pullEvents();
    await this.eventStore.appendEvents(course.id.value, newEvents);
    return Result.success<StartCourseResponse>({
      courseId: course.id.value,
    });
  }
}
