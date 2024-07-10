import { When, world } from '@cucumber/cucumber';
import { Result } from '@app/core';
import { CreateAnswerCommandHandler } from 'apps/api/src/course/application';
import { CreateAnswerResponse } from 'apps/api/src/course/application/commands/create-answer/types';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { ExceptionHandlerDecoratorMock } from 'apps/api/test/mocks/exception-parser.decorator.mock';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';

When(
  'the instructor with id {string} answer the question',
  async (instructorId: string) => {
    const courseId: string = world.courseId;
    const idGenerator = new IdGeneratorMock();
    const eventStore: EventStoreMock = world.eventStore;
    const questionId: string = world.questionId;
    let result: Result<CreateAnswerResponse>;
    const service = new ExceptionHandlerDecoratorMock(
      new CreateAnswerCommandHandler(idGenerator, eventStore),
    );
    result = await service.execute({
      courseId,
      content: 'answer content',
      instructor: instructorId,
      question: questionId ?? idGenerator.generateId(),
    });
    world.result = result;
  },
);
