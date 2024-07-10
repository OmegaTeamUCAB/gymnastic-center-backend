import { Result } from '@app/core';
import { Then, world } from '@cucumber/cucumber';
import { CreateAnswerResponse } from 'apps/api/src/course/application/commands/create-answer/types';
import { QuestionAnswered } from 'apps/api/src/course/domain/events';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { partialCompare } from 'apps/api/test/utils/partial-object-compare';
import { InvalidInstructorToAnswerException } from 'apps/api/src/course/domain/exceptions/invalid-instructor-to-answer.exception';
import assert from 'assert';

Then('The answer should be created in the lesson', async () => {
  const courseId: string = world.courseId;
  const questionId: string = world.questionId;
  const eventStore: EventStoreMock = world.eventStore;
  const events = await eventStore.getEventsByStream(courseId);
  assert.strictEqual(events.length, 2);
  assert.strictEqual(events[1].name, QuestionAnswered.name);
  assert.deepEqual(events[1].dispatcherId, courseId);
  assert.deepEqual(
    partialCompare(events[1].context, {
      question: questionId,
    }),
    true,
  );
});

Then('The answer should not be created in the lesson', async () => {
  const eventStore: EventStoreMock = world.eventStore;
  const courseId: string = world.courseId;
  const events = await eventStore.getEventsByStream(courseId);
  assert.strictEqual(events.length, 1);
});

Then('The instructor can not answer', async () => {
  const result: Result<CreateAnswerResponse> = world.result;
  assert.strictEqual(result.isFailure, true);
  assert.throws(() => result.unwrap(), InvalidInstructorToAnswerException);
});
