import {
  ApplicationService,
  EventHandler,
  EventStore,
  IdGenerator,
  Result,
} from '@app/core';
import { CreateInstructorCommand } from '../create-instructor.command-handler';
import { CreateInstructorResponse } from './response.type';
import { Instructor } from 'apps/api/src/instructor/domain/instructor';
import {
  InstructorFollowers,
  InstructorId,
  InstructorName,
  InstructorUserFollow,
} from 'apps/api/src/instructor/domain/value-objects';
import {
  AddressCity,
  AddressCountry,
} from 'apps/api/src/instructor/domain/entities/address-entity/value-objects';

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
      city: new AddressCity(command.city),
      country: new AddressCountry(command.country),
      followers: new InstructorFollowers(command.followers),
      userFollow: new InstructorUserFollow(command.userFollow),
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
