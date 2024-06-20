import { ApplicationService, EventHandler, EventStore, Result } from "@app/core";
import { DeleteCommentCommand, DeleteCommentResponse } from "./types";
import { CommentId } from "../../../domain/value-objects";
import { UserId } from "apps/api/src/user/domain/value-objects";
import { Comment } from "../../../domain";

export class DeleteCommentCommandHandler
  implements ApplicationService<DeleteCommentCommand, DeleteCommentResponse>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
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
      await this.eventStore.getEventsByStream(data.commentId.value
        
      ));

    comment.delete(data.commentId, data.userId);

    const events = comment.pullEvents();

    await this.eventStore.appendEvents(data.commentId.value, events);
    this.eventHandler.publishEvents(events);
    return Result.success<DeleteCommentResponse>({
      id: data.commentId.value
    });
  }
}