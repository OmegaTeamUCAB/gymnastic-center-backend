import {
  ApplicationService,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { FollowInstructorCommand, FollowInstructorResponse } from './types';
import { Instructor } from 'apps/api/src/instructor/domain/instructor';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export class FollowInstructorCommandHandler
  implements
    ApplicationService<FollowInstructorCommand, FollowInstructorResponse>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: FollowInstructorCommand,
  ): Promise<Result<FollowInstructorResponse>> {
    const events = await this.eventStore.getEventsByStream(
      command.instructorId,
    );
    const instructor = Instructor.loadFromHistory(
      new InstructorId(command.instructorId),
      events,
    );
    instructor.follow(new UserId(command.userId));
    const newEvents = instructor.pullEvents();
    await this.eventStore.appendEvents(command.instructorId, newEvents);
    this.eventHandler.publishEvents(newEvents);
    return Result.success<FollowInstructorResponse>({
      id: command.instructorId,
    });
  }
}
