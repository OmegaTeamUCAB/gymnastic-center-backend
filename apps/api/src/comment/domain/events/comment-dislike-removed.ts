import { DomainEvent } from '@app/core';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { CommentId } from '../value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export type CommentDislikeRemovedEvent = DomainEvent<CommentDislikeRemoved>;

export class CommentDislikeRemoved {
  private constructor() {}
  user: string;
  static createEvent(
    dispatcher: CommentId,
    user: UserId,
  ): CommentDislikeRemovedEvent {
    return DomainEventFactory<CommentDislikeRemoved>({
      dispatcherId: dispatcher.value,
      name: CommentDislikeRemoved.name,
      context: { user: user.value },
    });
  }
}
