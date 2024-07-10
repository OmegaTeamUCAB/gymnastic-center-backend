import { When, world } from '@cucumber/cucumber';
import { CreateAnswerCommandHandler } from 'apps/api/src/course/application';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';

When(
  'the instructor with id {string} answer the question',
  async (instructorId: string) => {
    const courseId: string = world.courseId;
    const idGenerator = new IdGeneratorMock();
    const eventStore: EventStoreMock = world.eventStore;
    const questionId: string = world.questionId;
    const service = new CreateAnswerCommandHandler(idGenerator, eventStore);
    const result = await service.execute({
      courseId,
      content: 'answer content',
      instructor: instructorId,
      question: questionId,
    });
    world.result = result;
  },
);
