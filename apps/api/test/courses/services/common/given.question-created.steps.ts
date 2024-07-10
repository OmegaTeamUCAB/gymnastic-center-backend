import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { Given, world } from '@cucumber/cucumber';
import { QuestionCreated } from 'apps/api/src/course/domain/events';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';

Given('the user create a question in the lesson with id {string}', async () => {
  const idGenerator = new IdGeneratorMock();
  const eventStore = new EventStoreMock();
  const userId = world.idGenerator.generateId();
  const courseId = world.courseId;
  const lessonId = world.lessonId;
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
});
