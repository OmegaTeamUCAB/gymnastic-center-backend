import {
  ApplicationService,
  EventHandler,
  EventStore,
  IdGenerator,
  Result,
} from '@app/core';
import { ToggleDislikeCommand, ToggleDislikeResponse } from './types';
import { CommentNotFoundException } from '../../exceptions';
import { Comment } from '../../../domain';
import { CommentId } from '../../../domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export class ToggleDislikeCommandHandler
  implements ApplicationService<ToggleDislikeCommand, ToggleDislikeResponse>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: ToggleDislikeCommand,
  ): Promise<Result<ToggleDislikeResponse>> {
    const events = await this.eventStore.getEventsByStream(command.commentId);
    if (events.length === 0)
      return Result.failure(new CommentNotFoundException());

    const comment = Comment.loadFromHistory(
      new CommentId(command.commentId),
      events,
    );

    const user = new UserId(command.userId);

    comment.addDislike(user);

    const newEvents = comment.pullEvents();

    await this.eventStore.appendEvents(command.commentId, newEvents);
    this.eventHandler.publishEvents(newEvents);
    return Result.success<ToggleDislikeResponse>({
      id: command.commentId,
    });
  }
}
