import {
  ApplicationService,
  EventHandler,
  EventStore,
  IdGenerator,
  Result,
} from '@app/core';
import { CreateCommentCommand, CreateCommentResponse } from './types';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { BlogId } from 'apps/api/src/blog/domain/value-objects';
import { Comment } from '../../../domain';
import { CommentContent, CommentId } from '../../../domain/value-objects';

export class CreateCommentCommandHandler
  implements ApplicationService<CreateCommentCommand, CreateCommentResponse>
{
  constructor(
    private readonly idGenerator: IdGenerator<string>,
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: CreateCommentCommand,
  ): Promise<Result<CreateCommentResponse>> {
    const id = this.idGenerator.generateId();

    const data = {
      content: new CommentContent(command.content),
      blog: new BlogId(command.blog),
      publisher: new UserId(command.publisher),
    };

    const comment = Comment.create(new CommentId(id), data);

    const events = comment.pullEvents();
    await this.eventStore.appendEvents(id, events);
    this.eventHandler.publishEvents(events);
    return Result.success<CreateCommentResponse>({
      id,
    });
  }
}
