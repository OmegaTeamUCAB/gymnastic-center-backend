import { DomainEvent } from '@app/core';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { CommentContent, CommentDate, CommentId } from '../value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { BlogId } from 'apps/api/src/blog/domain/value-objects';

export type CommentCreatedEvent = DomainEvent<CommentCreated>;

export class CommentCreated {
  private constructor() {}
  content: string;
  blog: string;
  publisher: string;

  static createEvent(
    dispatcher: CommentId,
    content: CommentContent,
    blog: BlogId,
    publisher: UserId,
  ): CommentCreatedEvent {
    return DomainEventFactory<CommentCreated>({
      dispatcherId: dispatcher.value,
      name: CommentCreated.name,
      context: {
        content: content.value,
        blog: blog.value,
        publisher: publisher.value,
      },
    });
  }
}
