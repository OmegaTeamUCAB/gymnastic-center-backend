import { DomainEvent } from '@app/core';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { CommentId } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type CommentLikedEvent = DomainEvent<CommentLiked>;

export class CommentLiked {
  private constructor() {}
  user: string;
  static createEvent(dispatcher: CommentId, user: UserId): CommentLikedEvent {
    return DomainEventFactory<CommentLiked>({
      dispatcherId: dispatcher.value,
      name: CommentLiked.name,
      context: {
        user: user.value,
      },
    });
  }
}
