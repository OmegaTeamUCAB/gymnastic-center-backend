import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  EVENT_STORE,
  EventStore,
  ExceptionParserDecorator,
  ILogger,
  IdResponse,
  LOGGER,
  LoggingDecorator,
  NativeTimer,
  PerformanceMonitorDecorator,
  baseExceptionParser,
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
import { DeleteCommentCommandHandler } from '../../application/commands/delete-comment/delete-comment.command-handler';
import { ToggleLikeCommandHandler } from '../../application/commands/toggle-like/toggle-like.command-handler';
import { ToggleDislikeCommandHandler } from '../../application/commands/toggle-dislike/toggle-dislike.command-handler';

@Controller('comment')
@ApiTags('comments')
@Auth()
export class CommentController {
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
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
    const operationName = 'Delete Comment';
    const service = new ExceptionParserDecorator(
      new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new DeleteCommentCommandHandler(this.eventStore),
          new NativeTimer(),
          this.logger,
          operationName,
        ),
        this.logger,
        operationName,
      ),
      baseExceptionParser,
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
    const operationName = 'Toggle Like';
    const service = new ExceptionParserDecorator(
      new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new ToggleLikeCommandHandler(this.eventStore),
          new NativeTimer(),
          this.logger,
          operationName,
        ),
        this.logger,
        operationName,
      ),
      baseExceptionParser,
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
    const operationName = 'Toggle Dislike';
    const service = new ExceptionParserDecorator(
      new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new ToggleDislikeCommandHandler(this.eventStore),
          new NativeTimer(),
          this.logger,
          operationName,
        ),
        this.logger,
        operationName,
      ),
      baseExceptionParser,
    )
    const result = await service.execute({
      commentId: id,
      userId: credentials.userId,
    });
    return result.unwrap();
  }
}
