import { DomainEvent } from '@app/core';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { CommentId } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type CommentDislikedEvent = DomainEvent<CommentDisliked>;

export class CommentDisliked {
  private constructor() {}
  user: string;
  static createEvent(
    dispatcher: CommentId,
    user: UserId,
  ): CommentDislikedEvent {
    return DomainEventFactory<CommentDisliked>({
      dispatcherId: dispatcher.value,
      name: CommentDisliked.name,
      context: {
        user: user.value,
      },
    });
  }
}
