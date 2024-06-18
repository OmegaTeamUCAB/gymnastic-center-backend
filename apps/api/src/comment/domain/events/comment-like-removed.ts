import { DomainEvent } from '@app/core';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { CommentId } from '../value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export type CommentLikeRemovedEvent = DomainEvent<CommentLikeRemoved>;

export class CommentLikeRemoved {
  private constructor() {}
  user: string;
  static createEvent(
    dispatcher: CommentId,
    user: UserId,
  ): CommentLikeRemovedEvent {
    return DomainEventFactory<CommentLikeRemoved>({
      dispatcherId: dispatcher.value,
      name: CommentLikeRemoved.name,
      context: { user: user.value },
    });
  }
}
