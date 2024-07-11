import { InjectAlgoliaInsights } from '@app/core';
import { Injectable } from '@nestjs/common';
import { Projector } from '../../types/projector.interface';
import { EventType } from '../../types';
import { InsightsClient } from 'search-insights';

@Injectable()
export class AlgoliaEventsProjector implements Projector {
  constructor(
    @InjectAlgoliaInsights()
    private readonly algolia: InsightsClient,
  ) {}

  async clear() {}

  async project(event: EventType): Promise<void> {
    const handler = this[`on${event.name}`];
    if (handler) await handler.call(this, event);
  }

  async onCourseStarted(
    event: EventType<{
      user: string;
    }>,
  ) {
    this.algolia('convertedObjectIDs', {
      eventName: 'Course Started',
      index: 'courses',
      userToken: event.context.user,
      objectIDs: [event.dispatcherId],
    });
  }

  async onCourseLessonWatched(
    event: EventType<{
      user: string;
      lesson: string;
      completionPercentage: number;
      lastSecondWatched: number;
    }>,
  ) {
    this.algolia('convertedObjectIDs', {
      eventName: 'Course Watched',
      index: 'courses',
      userToken: event.context.user,
      objectIDs: [event.dispatcherId],
    });
  }

  async onCourseCompleted(
    event: EventType<{
      user: string;
    }>,
  ) {
    this.algolia('convertedObjectIDs', {
      eventName: 'Course Completed',
      index: 'courses',
      userToken: event.context.user,
      objectIDs: [event.dispatcherId],
    });
  }
}
