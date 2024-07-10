import { When, world } from '@cucumber/cucumber';
import { CreateQuestionCommandHandler } from 'apps/api/src/course/application';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';

When(
  'the user create a question in the lesson with id {string}',
  async (lessonId: string) => {
    const idGenerator = new IdGeneratorMock();
    const userId = idGenerator.generateId();
    const courseId = world.courseId;
    const service = new CreateQuestionCommandHandler(
      new IdGeneratorMock(),
      world.eventStore as EventStoreMock,
    );
    await service.execute({
      courseId,
      lesson: lessonId,
      user: userId,
      content: 'question content',
    });
  },
);
