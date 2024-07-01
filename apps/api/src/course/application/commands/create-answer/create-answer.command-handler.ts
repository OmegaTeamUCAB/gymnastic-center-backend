import {
  EventStore,
  IdGenerator,
  Result,
  Service,
} from '@app/core';
import { CreateAnswerCommand, CreateAnswerResponse } from './types';
import { CourseNotFoundException } from '../../exceptions';
import { CourseId } from '../../../domain/value-objects';
import { Course } from '../../../domain';
import { Answer } from '../../../domain/entities/answers/answer';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';
import {
  AnswerContent,
  AnswerDate,
  AnswerId,
} from '../../../domain/entities/answers/value-objects';
import { QuestionId } from '../../../domain/entities/questions/value-objects';

export class CreateAnswerCommandHandler
  implements Service<CreateAnswerCommand, CreateAnswerResponse>
{
  constructor(
    private readonly idGenerator: IdGenerator<string>,
    private readonly eventStore: EventStore,
  ) {}

  async execute(
    command: CreateAnswerCommand,
  ): Promise<Result<CreateAnswerResponse>> {
    const events = await this.eventStore.getEventsByStream(command.courseId);
    if (events.length === 0) throw new CourseNotFoundException();
    const course = Course.loadFromHistory(
      new CourseId(command.courseId),
      events,
    );
    course.addAnswer(
      new Answer(
        new AnswerId(this.idGenerator.generateId()),
        new QuestionId(command.question),
        new InstructorId(command.instructor),
        new AnswerContent(command.content),
        new AnswerDate(new Date()),
      ),
    );
    const newEvents = course.pullEvents();
    await this.eventStore.appendEvents(command.courseId, newEvents);
    return Result.success<CreateAnswerResponse>({
      id: command.courseId,
    });
  }
}
