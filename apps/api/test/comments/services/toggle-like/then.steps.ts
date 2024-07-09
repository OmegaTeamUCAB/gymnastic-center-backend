import { Then, world } from '@cucumber/cucumber';
import assert from 'assert';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import {
  CommentLiked,
  CommentLikeRemoved,
} from 'apps/api/src/comment/domain/events';

Then('the like of the user with id {string} should be added in the comment', async (userId: string) => {
  const commentId: string = world.commentId;
  const eventStore: EventStoreMock = world.eventStore;
  const events = await eventStore.getEventsByStream(commentId);
  assert.strictEqual(events.length, 2);
  assert.strictEqual(events[1].name, CommentLiked.name);
  assert.deepEqual(events[1].context, { user: userId });
});

Then('the like of the user with id {string} should be removed from the comment', async (userId: string) => {
  const commentId: string = world.commentId;
  const eventStore: EventStoreMock = world.eventStore;
  const events = await eventStore.getEventsByStream(commentId);
  assert.strictEqual(events.length, 3);
  assert.strictEqual(events[2].name, CommentLikeRemoved.name);
  assert.deepEqual(events[2].context, { user: userId });
});
