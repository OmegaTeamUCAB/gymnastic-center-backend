// import {
//   ApplicationService,
//   EventHandler,
//   EventStore,
//   Result,
// } from '@app/core';
// import { UpdateInstructorCommand, UpdateInstructorResponse } from './types';
// import { Instructor } from '../../../domain/instructor';
// import {
//   InstructorFollowers,
//   InstructorId,
//   InstructorName,
//   InstructorUserFollow,
// } from '../../../domain/value-objects';
// import { InstructorNotFoundException } from '../../exceptions/instructor-not-found';
// import { AddressCity, AddressCountry } from '../../../domain/entities/address-entity/value-objects';

// export class UpdateInstructorCommandHandler
//   implements
//     ApplicationService<UpdateInstructorCommand, UpdateInstructorResponse>
// {
//   constructor(
//     private readonly eventStore: EventStore,
//     private readonly eventHandler: EventHandler,
//   ) {}

//   async execute(
//     command: UpdateInstructorCommand,
//   ): Promise<Result<UpdateInstructorResponse>> {
//     const events = await this.eventStore.getEventsByStream(command.id);
//     if (events.length === 0) throw new InstructorNotFoundException();
//     const instructor = Instructor.loadFromHistory(
//       new InstructorId(command.id),
//       events,
//     );
//     if (command.name) instructor.updateName(new InstructorName(command.name));
//     // if (command.city) instructor.updateCity(new AddressCity(command.city));
//     if (command.country) instructor.updateAddress(new AddressCountry(command.country));
    
//     const newEvents = instructor.pullEvents();
//     await this.eventStore.appendEvents(command.id, newEvents);
//     this.eventHandler.publishEvents(newEvents);
//     return Result.success<UpdateInstructorResponse>({
//       id: command.id,
//     });
//   }
// }
