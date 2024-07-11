import { Result } from '@app/core';
import { Then, world } from '@cucumber/cucumber';
import assert from 'assert';
import { CreateAnswerResponse } from 'apps/api/src/course/application/commands/create-answer/types';
import { QuestionAnswered } from 'apps/api/src/course/domain/events';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { partialCompare } from 'apps/api/test/utils/partial-object-compare';
import { InvalidInstructorToAnswerException } from 'apps/api/src/course/domain/exceptions/invalid-instructor-to-answer.exception';
import { QuestionAlreadyAnsweredException, QuestionNotFoundException } from 'apps/api/src/course/domain/exceptions';

Then('The answer should be created in the lesson', async () => {
  const courseId: string = world.courseId;
  const questionId: string = world.questionId;
  const eventStore: EventStoreMock = world.eventStore;
  const events = await eventStore.getEventsByStream(courseId);
  assert.strictEqual(events.length, 3);
  assert.strictEqual(events[2].name, QuestionAnswered.name);
  assert.deepEqual(events[2].dispatcherId, courseId);
  assert.deepEqual(
    partialCompare(events[2].context, {
      questionId: questionId,
    }),
    true,
  );
});

Then('The answer should not be created in the lesson', async () => {
  const eventStore: EventStoreMock = world.eventStore;
  const courseId: string = world.courseId;
  const events = await eventStore.getEventsByStream(courseId);
  assert.ok(events.length <= 2);
});

Then('The instructor cannot answer', async () => {
  const result: Result<CreateAnswerResponse> = world.result;
  assert.strictEqual(result.isFailure, true);
  assert.throws(() => result.unwrap(), InvalidInstructorToAnswerException);
});

Then('The second answer should not be created in the lesson', async () => {
  const result: Result<CreateAnswerResponse> = world.result;
  assert.strictEqual(result.isFailure, true);
  assert.throws(() => result.unwrap(), QuestionAlreadyAnsweredException);
});

Then('The question is not found', async () => {
  const result: Result<CreateAnswerResponse> = world.result;
  assert.strictEqual(result.isFailure, true);
  assert.throws(() => result.unwrap(), QuestionNotFoundException);
});
