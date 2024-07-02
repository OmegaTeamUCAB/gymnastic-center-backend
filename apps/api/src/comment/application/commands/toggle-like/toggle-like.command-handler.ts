import {
  Service,
  EventStore,
  Result,
} from '@app/core';
import { ToggleLikeCommand, ToggleLikeResponse } from './types';
import { CommentNotFoundException } from '../../exceptions';
import { Comment } from '../../../domain';
import { CommentId } from '../../../domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export class ToggleLikeCommandHandler
  implements Service<ToggleLikeCommand, ToggleLikeResponse>
{
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  async execute(
    command: ToggleLikeCommand,
  ): Promise<Result<ToggleLikeResponse>> {
    const events = await this.eventStore.getEventsByStream(command.commentId);
    if (events.length === 0)
      return Result.failure(new CommentNotFoundException());
    const comment = Comment.loadFromHistory(
      new CommentId(command.commentId),
      events,
    );
    if (!comment.isActive)
      return Result.failure(new CommentNotFoundException());
    const user = new UserId(command.userId);
    if (comment.isLikedBy(user)) comment.removeLike(user);
    else comment.addLike(user);
    const newEvents = comment.pullEvents();
    await this.eventStore.appendEvents(command.commentId, newEvents);
    return Result.success<ToggleLikeResponse>({
      id: command.commentId,
    });
  }
}
