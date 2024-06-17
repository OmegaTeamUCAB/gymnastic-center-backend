import { DomainEvent } from '@app/core';
import { BlogId, BlogTag } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type BlogTagsUpdatedEvent = DomainEvent<BlogTagsUpdated>;

export class BlogTagsUpdated {
  private constructor() {}
  tags: string[];
  static createEvent(
    dispatcher: BlogId,
    blogTags: BlogTag[],
  ): BlogTagsUpdatedEvent {
    return DomainEventFactory<BlogTagsUpdated>({
      dispatcherId: dispatcher.value,
      name: BlogTagsUpdated.name,
      context: {
        tags: blogTags.map((tag) => tag.value),
      },
    });
  }
}
