import {
  ApplicationService,
  EventHandler,
  EventStore,
  IdGenerator,
  Result,
} from '@app/core';

import { Instructor } from 'apps/api/src/instructor/domain/instructor';
import {
  InstructorFollowers,
  InstructorId,
  InstructorName,
  InstructorUserFollow,
} from 'apps/api/src/instructor/domain/value-objects';
import {
  AddressCity,
  AddressCoordinates,
  AddressCountry,
} from 'apps/api/src/instructor/domain/entities/address-entity/value-objects';
import { CreateInstructorCommand, CreateInstructorResponse } from './types';

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
      latitude: new AddressCoordinates(command.latitude, command.longitude),
      longitude: new AddressCoordinates(command.latitude, command.longitude),
      followers: new InstructorFollowers(command.followers),
      userFollow: new InstructorUserFollow(command.userFollow),
    };
    console.log('HOLA', id)
    const instructor = Instructor.create(new InstructorId(id), data);
    console.log('ESTE ES EL INSTRUCTOR ',instructor);
    const events = instructor.pullEvents();
    await this.eventStore.appendEvents(id, events);
    this.eventHandler.publishEvents(events);
    return Result.success<CreateInstructorResponse>({
      id,
    });
  }
}
