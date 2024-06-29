import { EventStore, Result, Service } from '@app/core';
import { WatchLessonCommand, WatchLessonResponse } from './types';
import { CourseNotFoundException } from '../../exceptions';
import { Course } from '../../../domain';
import { CourseId } from '../../../domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { LessonId } from '../../../domain/entities/lessons/value-objects';
import {
  CompletionPercentage,
  LastSecondWatched,
} from '../../../domain/entities/user-progress/value-objects';

export class WatchLessonCommandHandler
  implements Service<WatchLessonCommand, WatchLessonResponse>
{
  constructor(private readonly eventStore: EventStore) {}

  async execute(
    command: WatchLessonCommand,
  ): Promise<Result<WatchLessonResponse>> {
    const events = await this.eventStore.getEventsByStream(command.courseId);
    if (events.length === 0) throw new CourseNotFoundException();
    const course = Course.loadFromHistory(
      new CourseId(command.courseId),
      events,
    );
    course.watchLesson(
      new LessonId(command.lessonId),
      new UserId(command.userId),
      new LastSecondWatched(command.lastSecondWatched),
      new CompletionPercentage(
        (command.lastSecondWatched * 100) / command.totalSeconds,
      ),
    );
    const newEvents = course.pullEvents();
    await this.eventStore.appendEvents(course.id.value, newEvents);
    return Result.success<WatchLessonResponse>({
      courseId: course.id.value,
    });
  }
}
