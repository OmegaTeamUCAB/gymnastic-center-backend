import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CategoryId } from 'apps/api/src/category/domain/value-objects/category-id';
import { CourseId } from '../value-objects';

export type CourseCategoryUpdatedEvent = DomainEvent<CourseCategoryUpdated>;

export class CourseCategoryUpdated {
  private constructor() {}
  category: string;
  static createEvent(
    dispatcher: CourseId,
    courseCategory: CategoryId,
  ): CourseCategoryUpdatedEvent {
    return DomainEventFactory<CourseCategoryUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseCategoryUpdated.name,
      context: {
        category: courseCategory.value,
      },
    });
  }
}
