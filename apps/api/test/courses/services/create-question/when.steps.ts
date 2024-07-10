import { When, world } from '@cucumber/cucumber';
import { CreateQuestionCommandHandler } from 'apps/api/src/course/application';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';

When(
  'the user create a question in the lesson with id {string}',
  async (lessonId: string) => {
    const userId = world.idGenerator.generateId();
    const courseId = world.courseId;
    const service = new CreateQuestionCommandHandler(
      world.idGenerator,
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
