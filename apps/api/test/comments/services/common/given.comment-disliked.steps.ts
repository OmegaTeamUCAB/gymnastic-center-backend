import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { Given, world } from '@cucumber/cucumber';
import { CommentDisliked } from 'apps/api/src/comment/domain/events';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';

Given(
  'the comment is disliked by the user with id {string}',
  (userId: string) => {
    const eventStore: EventStoreMock = world.eventStore;
    eventStore.appendEvents(world.commentId, [
      DomainEventFactory<CommentDisliked>({
        name: CommentDisliked.name,
        dispatcherId: world.commentId,
        context: {
          user: userId,
        },
      }),
    ]);
  },
);
