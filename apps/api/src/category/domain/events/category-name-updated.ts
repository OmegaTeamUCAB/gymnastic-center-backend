import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CategoryId } from '../value-objects/category-id';
import { CategoryName } from '../value-objects/category-name';

export type CategoryNameUpdatedEvent = DomainEvent<CategoryNameUpdated>;

export class CategoryNameUpdated {
  private constructor() {}
  name: string;
  static createEvent(
    dispatcher: CategoryId,
    categoryName: CategoryName,
  ): CategoryNameUpdatedEvent {
    return DomainEventFactory<CategoryNameUpdated>({
      dispatcherId: dispatcher.id,
      name: CategoryNameUpdated.name,
      context: {
        name: categoryName.name,
      },
    });
  }
}
