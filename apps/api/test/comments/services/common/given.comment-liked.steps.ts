import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { Given, world } from '@cucumber/cucumber';
import { CommentLiked } from 'apps/api/src/comment/domain/events';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';

Given('the comment is liked by the user with id {string}', (userId: string) => {
  const eventStore: EventStoreMock = world.eventStore;
  eventStore.appendEvents(world.commentId, [
    DomainEventFactory<CommentLiked>({
      name: CommentLiked.name,
      dispatcherId: world.commentId,
      context: {
        user: userId,
      },
    }),
  ]);
});
