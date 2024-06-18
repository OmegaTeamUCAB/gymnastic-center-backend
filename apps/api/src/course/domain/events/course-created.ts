import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';
import {
  CourseDescription,
  CourseDuration,
  CourseId,
  CourseImage,
  CourseLevel,
  CourseMinute,
  CourseName,
  CoursePublishDate,
  CourseTag,
  CourseWeek,
} from '../value-objects';
import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CategoryId } from 'apps/api/src/category/domain/value-objects/category-id';
import { Lesson } from '../entities/lessons/lesson';

export type CourseCreatedEvent = DomainEvent<CourseCreated>;

export class CourseCreated {
  private constructor() {}
  name: string;
  description: string;
  level: number;
  tags: string[];
  weeks: number;
  minutes: number;
  image: string;
  category: string;
  instructor: string;
  publishDate: Date;
  lessons: {
    id: string;
    title: string;
    description: string;
    video: string;
  }[];
  static createEvent(
    dispatcher: CourseId,
    courseName: CourseName,
    courseDescription: CourseDescription,
    courseLevel: CourseLevel,
    courseTags: CourseTag[],
    courseDuration: CourseDuration,
    courseImage: CourseImage,
    courseCategory: CategoryId,
    courseInstructor: InstructorId,
    coursePublishDate: CoursePublishDate,
    courseLesson: Lesson[],
  ): CourseCreatedEvent {
    return DomainEventFactory<CourseCreated>({
      dispatcherId: dispatcher.value,
      name: CourseCreated.name,
      context: {
        name: courseName.value,
        description: courseDescription.value,
        level: courseLevel.value,
        tags: courseTags.map((tag) => tag.value),
        weeks: courseDuration.weeks,
        minutes: courseDuration.minutes,
        image: courseImage.value,
        category: courseCategory.value,
        instructor: courseInstructor.value,
        publishDate: coursePublishDate.value,
        lessons: courseLesson.map((lesson) => ({
          id: lesson.id.value,
          title: lesson.title.value,
          description: lesson.description.value,
          video: lesson.video.value,
        })),
      },
    });
  }
}
