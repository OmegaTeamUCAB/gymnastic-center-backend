import {
  Service,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { ToggleFollowCommand, ToggleFollowResponse } from './types';
import { Instructor } from 'apps/api/src/instructor/domain/instructor';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { InstructorNotFoundException } from '../../exceptions';

export class ToggleFollowCommandHandler
  implements Service<ToggleFollowCommand, ToggleFollowResponse>
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
    if (events.length === 0)
      return Result.failure(new InstructorNotFoundException());
    const instructor = Instructor.loadFromHistory(
      new InstructorId(command.instructorId),
      events,
    );
    const user = new UserId(command.userId);
    if (instructor.isFollowedBy(user)) instructor.removeFollower(user);
    else instructor.addFollower(user);
    const newEvents = instructor.pullEvents();
    await this.eventStore.appendEvents(command.instructorId, newEvents);
    this.eventHandler.publishEvents(newEvents);
    return Result.success<ToggleFollowResponse>({
      id: command.instructorId,
    });
  }
}
