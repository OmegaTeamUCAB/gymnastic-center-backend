import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Model } from 'mongoose';
import {
  EVENTS_QUEUE,
  EVENT_STORE,
  EventHandler,
  EventStore,
  IdGenerator,
  IdResponse,
  LOCAL_EVENT_HANDLER,
  MongoComment,
  SearchBlogsReadModel,
  SearchCoursesReadModel,
  SearchResponse,
  UUIDGENERATOR,
  CreateTargetedTextDto,
} from '@app/core';
import { Auth, CurrentUser } from './auth/infrastructure/decorators';
import { Credentials } from './auth/application/models/credentials.model';
import { CommentResponse } from './comment/infrastructure/controllers/responses';
import { CreateCommentCommandHandler } from './comment/application/commands/create-comment';

@Controller()
export class ApiController {
  constructor(
    @Inject(EVENTS_QUEUE)
    private readonly rmqClient: ClientProxy,
    @InjectModel(MongoComment.name)
    private readonly commentModel: Model<MongoComment>,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOCAL_EVENT_HANDLER)
    private readonly localEventHandler: EventHandler,
    private readonly searchCoursesReadModel: SearchCoursesReadModel,
    private readonly searchBlogsReadModel: SearchBlogsReadModel,
  ) {}

  @Get('health')
  health() {
    this.rmqClient.emit('health', {});
    return 'Health check sent';
  }

  @Get('search')
  @Auth()
  @ApiQuery({
    name: 'perPage',
    required: false,
    description:
      'Number of results to return for each type of search. DEFAULT = 3',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Number of . DEFAULT = 1',
    type: Number,
  })
  @ApiQuery({
    name: 'term',
    required: false,
    description: 'Search term',
    type: String,
  })
  @ApiQuery({
    name: 'tag',
    description: 'Search by tags. DEFAULT = []',
    required: false,
    type: [String],
  })
  @ApiResponse({
    status: 200,
    description: 'Search matching courses and blogs.',
    type: SearchResponse,
  })
  async search(
    @Query('term') searchTerm: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('perPage', new DefaultValuePipe(3), ParseIntPipe)
    perPage: number = 3,
    @Query('tag', new DefaultValuePipe([]), ParseArrayPipe) tag: string[] = [],
  ) {
    const [courses, blogs] = await Promise.all([
      this.searchCoursesReadModel.execute({ searchTerm, limit: perPage }),
      this.searchBlogsReadModel.execute({ searchTerm, limit: perPage }),
    ]);
    return {
      courses,
      blogs,
    };
  }

  @Get('comment/many')
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
    description: 'blog id to get comments from',
    type: String,
  })
  @ApiQuery({
    name: 'lesson',
    required: false,
    description: 'lesson id to get comments from',
    type: String,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort comments by date or likes. (LIKES | DATE)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all comments from a post or lesson',
    type: [CommentResponse],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async GetAllComments(
    @CurrentUser() credentials: Credentials,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
    @Query('blog') blog?: string,
    @Query('lesson') lesson?: string,
    @Query('sort') sort?: 'LIKES' | 'DATE',
  ): Promise<CommentResponse[]> {
    if (!blog && !lesson)
      throw new BadRequestException('You must provide a blog or lesson id');
    if (blog && lesson)
      throw new BadRequestException(
        'You must provide only one of blog or lesson id',
      );
    if (blog) {
      const comments = await this.commentModel.find(
        {
          blog,
        },
        null,
        {
          skip: (page - 1) * perPage,
          perPage,
          sort: sort === 'DATE' ? { publishDate: 1 } : { numberOfLikes: 1 },
        },
      );
      return comments.map((comment) => ({
        id: comment.id,
        user: comment.publisher.name,
        userId: comment.publisher.id,
        userImage: comment.publisher.image,
        countLikes: comment.numberOfLikes,
        countDislikes: comment.numberOfDislikes,
        userLiked: comment.likes.includes(credentials.userId),
        userDisliked: comment.dislikes.includes(credentials.userId),
        body: comment.content,
        date: comment.publishDate,
      }));
    }
    //TODO: QUESTIONS
  }

  @Post('comment/release')
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: IdResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createComment(
    @Body() createCommentDto: CreateTargetedTextDto,
    @CurrentUser() credentials: Credentials,
  ) {
    if (createCommentDto.targetType === 'BLOG') {
      const service = new CreateCommentCommandHandler(
        this.uuidGenerator,
        this.eventStore,
        this.localEventHandler,
      );
      const result = await service.execute({
        blog: createCommentDto.target,
        content: createCommentDto.body,
        publisher: credentials.userId,
      });
      return result.unwrap();
    }
    // TODO: QUESTIONS
  }
}
