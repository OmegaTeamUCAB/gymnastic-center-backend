import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  EVENT_STORE,
  EventHandler,
  EventStore,
  ILogger,
  IdResponse,
  LOCAL_EVENT_HANDLER,
  LOGGER,
  LoggingDecorator,
} from '@app/core';
import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Auth, CurrentUser } from 'apps/api/src/auth/infrastructure/decorators';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { ToggleLikeCommandHandler } from '../../application/commands/toggle-like';
import { ToggleDislikeCommandHandler } from '../../application/commands/toggle-dislike';
import { DeleteCommentCommandHandler } from '../../application/commands/delete-comment/delete-comment.command-handler';

@Controller('comment')
@ApiTags('comments')
@Auth()
export class CommentController {
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOCAL_EVENT_HANDLER)
    private readonly localEventHandler: EventHandler,
    @Inject(LOGGER)
    private readonly logger: ILogger,
  ) {}

  @Delete('delete/:id')
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
    type: IdResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteComment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() credentials: Credentials,
  ) {
    const service = new LoggingDecorator(
      new DeleteCommentCommandHandler(this.eventStore, this.localEventHandler),
      this.logger,
      'Delete Comment',
    );
    const result = await service.execute({
      commentId: id,
      userId: credentials.userId,
    });
    return result.unwrap();
  }

  @Post('toggle/like/:id')
  @ApiResponse({
    status: 200,
    description: 'Comment liked successfully',
    type: IdResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async likeComment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() credentials: Credentials,
  ) {
    const service = new LoggingDecorator(
      new ToggleLikeCommandHandler(this.eventStore, this.localEventHandler),
      this.logger,
      'Toggle Like',
    );
    const result = await service.execute({
      commentId: id,
      userId: credentials.userId,
    });
    return result.unwrap();
  }

  @Post('toggle/dislike/:id')
  @ApiResponse({
    status: 200,
    description: 'Comment disliked successfully',
    type: IdResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async dislikeComment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() credentials: Credentials,
  ) {
    const service = new LoggingDecorator(
      new ToggleDislikeCommandHandler(this.eventStore, this.localEventHandler),
      this.logger,
      'Toggle Dislike',
    );
    const result = await service.execute({
      commentId: id,
      userId: credentials.userId,
    });
    return result.unwrap();
  }
}