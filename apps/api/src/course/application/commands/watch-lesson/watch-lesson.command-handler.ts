import { EventStore, Result, Service } from '@app/core';
import { WatchLessonCommand, WatchLessonResponse } from './types';
import { CourseNotFoundException } from '../../exceptions';
import { Course } from '../../../domain';
import { CourseId } from '../../../domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { LessonId } from '../../../domain/entities/lessons/value-objects';
import { LastSecondWatched } from '../../../domain/entities/user-progress/value-objects';
import { CalculateCompletionPercentage } from '../../../domain/services/calculate-completion-percentage';

export class WatchLessonCommandHandler
  implements Service<WatchLessonCommand, WatchLessonResponse>
{
  constructor(private readonly eventStore: EventStore) {}

  async execute(
    command: WatchLessonCommand,
  ): Promise<Result<WatchLessonResponse>> {
    const {
      courseId,
      lastSecondWatched,
      lessonId,
      markAsCompleted,
      totalSeconds,
      userId,
    } = command;
    const events = await this.eventStore.getEventsByStream(courseId);
    if (events.length === 0) throw new CourseNotFoundException();
    const course = Course.loadFromHistory(new CourseId(courseId), events);
    const calculateCompletionPercentageService =
      new CalculateCompletionPercentage();
    course.watchLesson(
      new LessonId(lessonId),
      new UserId(userId),
      new LastSecondWatched(lastSecondWatched),
      calculateCompletionPercentageService.execute({
        lastSecondWatched,
        totalSeconds,
        markAsCompleted,
      }),
    );
    const newEvents = course.pullEvents();
    await this.eventStore.appendEvents(course.id.value, newEvents);
    return Result.success<WatchLessonResponse>({
      courseId: course.id.value,
    });
  }
}
