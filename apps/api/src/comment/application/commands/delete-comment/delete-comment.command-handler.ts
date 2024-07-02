import {
  Service,
  EventStore,
  Result,
} from '@app/core';
import { DeleteCommentCommand, DeleteCommentResponse } from './types';
import { CommentId } from '../../../domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { Comment } from '../../../domain';
import { CommentNotFoundException } from '../../exceptions';

export class DeleteCommentCommandHandler
  implements Service<DeleteCommentCommand, DeleteCommentResponse>
{
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  async execute(
    command: DeleteCommentCommand,
  ): Promise<Result<DeleteCommentResponse>> {
    const data = {
      commentId: new CommentId(command.commentId),
      userId: new UserId(command.userId),
    };
    const comment = Comment.loadFromHistory(
      data.commentId,
      await this.eventStore.getEventsByStream(data.commentId.value),
    );
    if (!comment.isActive)
      return Result.failure(new CommentNotFoundException());
    comment.delete(data.commentId, data.userId);
    const events = comment.pullEvents();
    await this.eventStore.appendEvents(data.commentId.value, events);
    return Result.success<DeleteCommentResponse>({
      id: data.commentId.value,
    });
  }
}
