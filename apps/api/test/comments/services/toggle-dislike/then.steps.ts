import { Then, world } from '@cucumber/cucumber';
import assert from 'assert';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import {
  CommentDisliked,
  CommentDislikeRemoved,
} from 'apps/api/src/comment/domain/events';

Then(
  'the dislike of the user with id {string} should be added in the comment',
  async (userId: string) => {
    const commentId: string = world.commentId;
    const eventStore: EventStoreMock = world.eventStore;
    const events = await eventStore.getEventsByStream(commentId);
    assert.ok(events.length >= 2);
    assert.strictEqual(events[events.length - 1].name, CommentDisliked.name);
    assert.deepEqual(events[events.length - 1].context, { user: userId });
  },
);

Then(
  'the dislike of the user with id {string} should be removed from the comment',
  async (userId: string) => {
    const commentId: string = world.commentId;
    const eventStore: EventStoreMock = world.eventStore;
    const events = await eventStore.getEventsByStream(commentId);
    assert.ok(events.length >= 3);
    assert.strictEqual(events[2].name, CommentDislikeRemoved.name);
    assert.deepEqual(events[2].context, { user: userId });
  },
);
