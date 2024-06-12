import { DomainEvent } from '@app/core';
import { BlogContent, BlogId } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type BlogContentUpdatedEvent = DomainEvent<BlogContentUpdated>;

export class BlogContentUpdated {
  private constructor() {}
  content: string;
  static createEvent(
    dispatcher: BlogId,
    blogContent: BlogContent,
  ): BlogContentUpdatedEvent {
    return DomainEventFactory<BlogContentUpdated>({
      dispatcherId: dispatcher.value,
      name: BlogContentUpdated.name,
      context: {
        content: blogContent.value,
      },
    });
  }
}
