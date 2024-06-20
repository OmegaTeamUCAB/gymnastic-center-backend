import { InjectModel } from '@nestjs/mongoose';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  EVENT_STORE,
  EventHandler,
  EventStore,
  IdGenerator,
  IdResponse,
  LOCAL_EVENT_HANDLER,
  UUIDGENERATOR,
} from '@app/core';
import { MongoComment } from '@app/core/infrastructure/models/mongo-comment.model';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Auth, CurrentUser } from 'apps/api/src/auth/infrastructure/decorators';
import { string } from 'joi';
import { Model } from 'mongoose';
import { CommentResponse } from './responses';
import { CreateCommentCommandHandler } from '../../application/commands/create-comment';
import { CreateCommentDto } from './dtos';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { ToggleLikeCommandHandler } from '../../application/commands/toggle-like';
import { ToggleDislikeCommandHandler } from '../../application/commands/toggle-dislike';
import { DeleteCommentCommandHandler } from '../../application/commands/delete-comment/delete-comment.command-handler';

@Controller('comment')
@ApiTags('comments')
@Auth()
export class CommentController {
  constructor(
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOCAL_EVENT_HANDLER)
    private readonly localEventHandler: EventHandler,
    @InjectModel(MongoComment.name)
    private readonly commentModel: Model<MongoComment>,
  ) {}

  @Get('many')
  @Auth()
  @ApiQuery({
    name: 'perPage',
    required: false,
    description:
      'Number of results to return for each type of search. DEFAULT = 8',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number of the results. DEFAULT = 1',
    type: Number,
  })
  @ApiQuery({
    name: 'blog',
    required: false,
    description: 'Check if it is a blog comment',
    type: string,
  })
  @ApiQuery({
    name: 'lesson',
    required: false,
    description: 'Check if it is a lesson comment',
    type: string,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all comments from a post or lesson',
    type: MongoComment,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async GetAllComments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
    @Query('blog') blog: string,
    @Query('lesson') lesson: string,
  ): Promise<CommentResponse[]> {
    const comments = await this.commentModel.find(
      {
        ...(blog && { blog }),
      },
      null,
      {
        skip: (page - 1) * perPage,
        perPage,
      },
    );
    return comments.map((comment) => ({
      id: comment.id,
      user: comment.publisher,
      countLikes: comment.likes.length,
      countDislikes: comment.dislikes.length,
      body: comment.content,
      date: comment.publishDate,
    }));
  }

  @Post('release')
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: IdResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    const service = new CreateCommentCommandHandler(
      this.uuidGenerator,
      this.eventStore,
      this.localEventHandler,
    );
    const result = await service.execute({ ...createCommentDto });
    return result.unwrap();
  }

  @Delete('delete/:id')
  @Auth()
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
    const service = new DeleteCommentCommandHandler(
      this.eventStore,
      this.localEventHandler,
    );
    const result = await service.execute({
      commentId: id,
      userId: credentials.userId,
    });
    return result.unwrap();
  }

  @Post('toggle/like/:id')
  @Auth()
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
    console.log('antes de crear el servicio');
    const service = new ToggleLikeCommandHandler(
      this.eventStore,
      this.localEventHandler,
    );
    console.log('antes de ejecutar el servicio');
    const result = await service.execute({
      commentId: id,
      userId: credentials.userId,
    });
    console.log('despues de ejecutar al servicio');
    return result.unwrap();
  }

  @Post('toggle/dislike/:id')
  @Auth()
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
    const service = new ToggleDislikeCommandHandler(
      this.eventStore,
      this.localEventHandler,
    );
    const result = await service.execute({
      commentId: id,
      userId: credentials.userId,
    });
    return result.unwrap();
  }
}
