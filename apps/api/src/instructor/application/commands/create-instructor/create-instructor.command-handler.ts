import {
  ApplicationService,
  EventHandler,
  EventStore,
  IdGenerator,
  Result,
} from '@app/core';
import { CreateInstructorCommand, CreateInstructorResponse } from './types';
import { Instructor } from 'apps/api/src/instructor/domain/instructor';
import {
  InstructorId,
  InstructorName,
} from 'apps/api/src/instructor/domain/value-objects';

export class CreateInstructorCommandHandler
  implements
    ApplicationService<CreateInstructorCommand, CreateInstructorResponse>
{
  constructor(
    private readonly idGenerator: IdGenerator<string>,
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: CreateInstructorCommand,
  ): Promise<Result<CreateInstructorResponse>> {
    const id = this.idGenerator.generateId();
    const data = {
      name: new InstructorName(command.name),
    };
    const instructor = Instructor.create(new InstructorId(id), data);
    const events = instructor.pullEvents();
    await this.eventStore.appendEvents(id, events);
    this.eventHandler.publishEvents(events);
    return Result.success<CreateInstructorResponse>({
      id,
    });
  }
}
