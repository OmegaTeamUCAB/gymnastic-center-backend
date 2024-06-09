import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CategoryId } from '../value-objects/category-id';
import { CategoryIcon } from '../value-objects/category-icon';

export type CategoryIconUpdatedEvent = DomainEvent<CategoryIconUpdated>;

export class CategoryIconUpdated {
  private constructor() {}
  icon: string;
  static createEvent(
    dispatcher: CategoryId,
    categoryIcon: CategoryIcon,
  ): CategoryIconUpdatedEvent {
    return DomainEventFactory<CategoryIconUpdated>({
      dispatcherId: dispatcher.id,
      name: CategoryIconUpdated.name,
      context: {
        icon: categoryIcon.icon,
      },
    });
  }
}
