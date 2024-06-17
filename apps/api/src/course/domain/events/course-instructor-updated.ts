import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';
import { CourseId } from '../value-objects';

export type CourseInstructorUpdatedEvent = DomainEvent<CourseInstructorUpdated>;

export class CourseInstructorUpdated {
  private constructor() {}
  instructor: string;
  static createEvent(
    dispatcher: CourseId,
    courseInstructor: InstructorId,
  ): CourseInstructorUpdatedEvent {
    return DomainEventFactory<CourseInstructorUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseInstructorUpdated.name,
      context: {
        instructor: courseInstructor.value,
      },
    });
  }
}
