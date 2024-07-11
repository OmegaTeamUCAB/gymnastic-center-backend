import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { Given, world } from '@cucumber/cucumber';
import { QuestionAnswered } from 'apps/api/src/course/domain/events';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';

Given(
  'the instructor with id {string} answered the question',
  async (instructorId: string) => {
    const idGenerator = new IdGeneratorMock();
    const eventStore: EventStoreMock = world.eventStore;
    const courseId: string = world.courseId;
    eventStore.appendEvents(courseId, [
      DomainEventFactory<QuestionAnswered>({
        name: QuestionAnswered.name,
        dispatcherId: courseId,
        context: {
          questionId: world.questionId,
          instructor: instructorId,
          answerId: idGenerator.generateId(),
          content: 'question content',
          date: new Date(),
        },
      }),
    ]);
  },
);
