import { Service, EventStore, Result } from '@app/core';
import { DeleteCommentCommand, DeleteCommentResponse } from './types';
import { CommentId } from '../../../domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { Comment } from '../../../domain';
import { CommentNotFoundException } from '../../exceptions';

export class DeleteCommentCommandHandler
  implements Service<DeleteCommentCommand, DeleteCommentResponse>
{
  constructor(private readonly eventStore: EventStore) {}

  async execute(
    command: DeleteCommentCommand,
  ): Promise<Result<DeleteCommentResponse>> {
    const commentId = new CommentId(command.commentId);
    const userId = new UserId(command.userId);
    const comment = Comment.loadFromHistory(
      commentId,
      await this.eventStore.getEventsByStream(commentId.value),
    );
    if (!comment.isActive)
      return Result.failure(new CommentNotFoundException());
    comment.delete(userId);
    const events = comment.pullEvents();
    await this.eventStore.appendEvents(commentId.value, events);
    return Result.success<DeleteCommentResponse>({
      id: commentId.value,
    });
  }
}
