import { DomainEvent } from '@app/core';
import { BlogId } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { CategoryId } from 'apps/api/src/category/domain/value-objects/category-id';

export type BlogCategoryUpdatedEvent = DomainEvent<BlogCategoryUpdated>;

export class BlogCategoryUpdated {
  private constructor() {}
  category: string;
  static createEvent(
    dispatcher: BlogId,
    blogCategory: CategoryId,
  ): BlogCategoryUpdatedEvent {
    return DomainEventFactory<BlogCategoryUpdated>({
      dispatcherId: dispatcher.value,
      name: BlogCategoryUpdated.name,
      context: {
        category: blogCategory.value,
      },
    });
  }
}
