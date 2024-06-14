import { DomainEvent } from '@app/core';
import { BlogId, BlogTitle } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type BlogTitleUpdatedEvent = DomainEvent<BlogTitleUpdated>;

export class BlogTitleUpdated {
  private constructor() {}
  title: string;
  static createEvent(
    dispatcher: BlogId,
    blogTitle: BlogTitle,
  ): BlogTitleUpdatedEvent {
    return DomainEventFactory<BlogTitleUpdated>({
      dispatcherId: dispatcher.value,
      name: BlogTitleUpdated.name,
      context: {
        title: blogTitle.value,
      },
    });
  }
}
