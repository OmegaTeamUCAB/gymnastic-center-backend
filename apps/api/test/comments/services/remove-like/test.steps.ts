import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { ToggleLikeCommandHandler } from 'apps/api/src/comment/application/commands/toggle-like/toggle-like.command-handler';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import {
  CommentCreated,
  CommentLiked,
  CommentLikeRemoved,
} from 'apps/api/src/comment/domain/events';

const eventStore = new EventStoreMock();
const idGenerator = new IdGeneratorMock();
const service = new ToggleLikeCommandHandler(eventStore);
const userId = idGenerator.generateId();
const commentId = idGenerator.generateId();

Given('the comment is created', () => {
  eventStore.appendEvents(idGenerator.generateId(), [
    DomainEventFactory<CommentCreated>({
      name: CommentCreated.name,
      dispatcherId: commentId,
      context: {
        date: new Date(),
        content: 'content',
        blog: idGenerator.generateId(),
        publisher: idGenerator.generateId(),
      },
    }),
  ]);
});

Given('the comment is liked by the user', () => {
  eventStore.appendEvents(idGenerator.generateId(), [
    DomainEventFactory<CommentLiked>({
      name: CommentLiked.name,
      dispatcherId: commentId,
      context: {
        user: userId,
      },
    }),
  ]);
});

When('the user toggle the like button on the comment', async () => {
  await service.execute({
    commentId,
    userId,
  });
});

Then('the like should be removed from the comment', async () => {
  const events = await eventStore.getEventsByStream(commentId);
  assert.strictEqual(events.length, 3);
  assert.strictEqual(events[2].name, CommentLikeRemoved.name);
  assert.deepEqual(events[2].context, { user: userId });
});
