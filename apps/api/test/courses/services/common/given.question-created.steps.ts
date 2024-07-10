import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { Given, world } from '@cucumber/cucumber';
import { QuestionCreated } from 'apps/api/src/course/domain/events';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';

Given(
  'an user create a question in the lesson with id {string}',
  async (lessonId: string) => {
    const idGenerator = new IdGeneratorMock();
    const eventStore: EventStoreMock = world.eventStore;
    const courseId: string = world.courseId;
    const userId = idGenerator.generateId();
    const questionId = idGenerator.generateId();
    eventStore.appendEvents(courseId, [
      DomainEventFactory<QuestionCreated>({
        name: QuestionCreated.name,
        dispatcherId: courseId,
        context: {
          questionId: questionId,
          user: userId,
          lesson: lessonId,
          content: 'question content',
          date: new Date(),
        },
      }),
    ]);
    world.questionId = questionId;
  },
);
