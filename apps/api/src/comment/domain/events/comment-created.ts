import { DomainEvent } from '@app/core';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { CommentContent, CommentDate, CommentId } from '../value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export type CommentCreatedEvent = DomainEvent<CommentCreated>;

export class CommentCreated {
  private constructor() {}
  content: string;
  publisher: string;
  publishDate: Date;

  static createEvent(
    dispatcher: CommentId,
    content: CommentContent,
    publisher: UserId,
    publishDate: CommentDate,
  ): CommentCreatedEvent {
    return DomainEventFactory<CommentCreated>({
      dispatcherId: dispatcher.value,
      name: CommentCreated.name,
      context: {
        content: content.value,
        publisher: publisher.value,
        publishDate: publishDate.value,
      },
    });
  }
}
