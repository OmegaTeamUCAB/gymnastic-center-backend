import { DomainEvent } from '@app/core';
import { CommentId } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type CommentDeletedEvent = DomainEvent<CommentDeleted>;

export class CommentDeleted {
  private constructor() {}
  static createEvent(dispatcher: CommentId): CommentDeletedEvent {
    return DomainEventFactory<CommentDeleted>({
      dispatcherId: dispatcher.value,
      name: CommentDeleted.name,
      context: {},
    });
  }
}
