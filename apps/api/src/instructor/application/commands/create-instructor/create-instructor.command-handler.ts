import { Service, EventStore, IdGenerator, Result } from '@app/core';
import { CreateInstructorCommand, CreateInstructorResponse } from './types';
import { Instructor } from 'apps/api/src/instructor/domain/instructor';
import { InstructorName } from '../../../domain/value-objects/instructor-name';
import { InstructorId } from '../../../domain/value-objects/instructor-id';
import { InstructorImage } from '../../../domain/value-objects/instructor-image';
import { InstructorLocation } from '../../../domain/value-objects/instructor-location';

export class CreateInstructorCommandHandler
  implements Service<CreateInstructorCommand, CreateInstructorResponse>
{
  constructor(
    private readonly idGenerator: IdGenerator<string>,
    private readonly eventStore: EventStore,
  ) {}

  async execute(
    command: CreateInstructorCommand,
  ): Promise<Result<CreateInstructorResponse>> {
    const id = this.idGenerator.generateId();
    const data = {
      name: new InstructorName(command.name),
      image: new InstructorImage(command.image),
      location: new InstructorLocation(command.city, command.country),
    };
    const instructor = Instructor.create(new InstructorId(id), data);
    const events = instructor.pullEvents();
    await this.eventStore.appendEvents(id, events);
    return Result.success<CreateInstructorResponse>({
      id,
    });
  }
}
