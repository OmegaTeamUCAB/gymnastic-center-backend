import { Then, world } from '@cucumber/cucumber';
import assert from 'assert';
import { QuestionCreated } from 'apps/api/src/course/domain/events';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { partialCompare } from 'apps/api/test/utils/partial-object-compare';

Then(
  'the question should be created in the lesson with id {string}',
  async (lessonId: string) => {
    const courseId: string = world.courseId;
    const eventStore: EventStoreMock = world.eventStore;
    const events = await eventStore.getEventsByStream(courseId);
    assert.strictEqual(events.length, 2);
    assert.strictEqual(events[1].name, QuestionCreated.name);
    assert.deepEqual(events[1].dispatcherId, courseId);
    assert.deepEqual(
      partialCompare(events[1].context, {
        lesson: lessonId,
      }),
      true,
    );
  },
);
