import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CategoryId } from '../value-objects/category-id';
import { CategoryName } from '../value-objects/category-name';
import { CategoryIcon } from '../value-objects/category-icon';

export type CategoryCreatedEvent = DomainEvent<CategoryCreated>;

export class CategoryCreated {
  private constructor() {}
  name: string;
  icon: string;
  static createEvent(
    dispatcher: CategoryId,
    categoryName: CategoryName,
    categoryIcon: CategoryIcon,
  ): CategoryCreatedEvent {
    return DomainEventFactory<CategoryCreated>({
      dispatcherId: dispatcher.id,
      name: CategoryCreated.name,
      context: {
        name: categoryName.name,
        icon: categoryIcon.icon,
      },
    });
  }
}
