import {
  ApplicationService,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { ToggleFollowCommand, ToggleFollowResponse } from './types';
import { Instructor } from 'apps/api/src/instructor/domain/instructor';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export class ToggleFollowCommandHandler
  implements ApplicationService<ToggleFollowCommand, ToggleFollowResponse>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: ToggleFollowCommand,
  ): Promise<Result<ToggleFollowResponse>> {
    const events = await this.eventStore.getEventsByStream(
      command.instructorId,
    );
    const instructor = Instructor.loadFromHistory(
      new InstructorId(command.instructorId),
      events,
    );
    const user = new UserId(command.userId);
    if (instructor.isFollowedBy(user)) instructor.unfollow(user);
    else instructor.follow(user);
    const newEvents = instructor.pullEvents();
    await this.eventStore.appendEvents(command.instructorId, newEvents);
    this.eventHandler.publishEvents(newEvents);
    return Result.success<ToggleFollowResponse>({
      id: command.instructorId,
    });
  }
}
