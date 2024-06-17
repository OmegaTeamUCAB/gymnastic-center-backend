import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';
import {
  CourseDescription,
  CourseId,
  CourseImage,
  CourseLevel,
  CourseMinute,
  CourseName,
  CourseTag,
  CourseWeek,
} from '../value-objects';
import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CategoryId } from 'apps/api/src/category/domain/value-objects/category-id';

export type CourseCreatedEvent = DomainEvent<CourseCreated>;

export class CourseCreated {
  private constructor() {}
  name: string;
  description: string;
  level: number;
  tags: string[];
  weeks: number;
  minutes: number;
  images: string[];
  category: string;
  instructor: string;
  static createEvent(
    dispatcher: CourseId,
    courseName: CourseName,
    courseDescription: CourseDescription,
    courseLevel: CourseLevel,
    courseTags: CourseTag[],
    courseWeeks: CourseWeek,
    courseMinutes: CourseMinute,
    courseImages: CourseImage[],
    courseCategory: CategoryId,
    courseInstructor: InstructorId,
  ): CourseCreatedEvent {
    return DomainEventFactory<CourseCreated>({
      dispatcherId: dispatcher.value,
      name: CourseCreated.name,
      context: {
        name: courseName.value,
        description: courseDescription.value,
        level: courseLevel.value,
        tags: courseTags.map((tag) => tag.value),
        weeks: courseWeeks.value,
        minutes: courseMinutes.value,
        images: courseImages.map((image) => image.value),
        category: courseCategory.value,
        instructor: courseInstructor.value,
      },
    });
  }
}
