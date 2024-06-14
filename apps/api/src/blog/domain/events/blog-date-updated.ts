import { DomainEvent } from '@app/core';
import { BlogDate, BlogId } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type BlogDateUpdatedEvent = DomainEvent<BlogDateUpdated>;

export class BlogDateUpdated {
  private constructor() {}
  date: Date;
  static createEvent(
    dispatcher: BlogId,
    blogDate: BlogDate,
  ): BlogDateUpdatedEvent {
    return DomainEventFactory<BlogDateUpdated>({
      dispatcherId: dispatcher.value,
      name: BlogDateUpdated.name,
      context: {
        date: blogDate.value,
      },
    });
  }
}
