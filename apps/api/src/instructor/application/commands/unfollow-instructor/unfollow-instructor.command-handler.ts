import {
  ApplicationService,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { UnfollowInstructorCommand, UnfollowInstructorResponse } from './types';
import { Instructor } from 'apps/api/src/instructor/domain/instructor';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export class UnfollowInstructorCommandHandler
  implements
    ApplicationService<UnfollowInstructorCommand, UnfollowInstructorResponse>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: UnfollowInstructorCommand,
  ): Promise<Result<UnfollowInstructorResponse>> {
    const events = await this.eventStore.getEventsByStream(
      command.instructorId,
    );
    const instructor = Instructor.loadFromHistory(
      new InstructorId(command.instructorId),
      events,
    );
    instructor.unfollow(new UserId(command.userId));
    const newEvents = instructor.pullEvents();
    await this.eventStore.appendEvents(command.instructorId, newEvents);
    this.eventHandler.publishEvents(newEvents);
    return Result.success<UnfollowInstructorResponse>({
      id: command.instructorId,
    });
  }
}
