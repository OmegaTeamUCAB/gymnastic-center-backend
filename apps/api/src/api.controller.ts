import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { InsightsClient } from 'search-insights';
import {
  EVENTS_QUEUE,
  EVENT_STORE,
  EventStore,
  IdGenerator,
  IdResponse,
  MongoComment,
  SearchResponse,
  UUIDGENERATOR,
  CreateTargetedTextDto,
  LoggingDecorator,
  ILogger,
  LOGGER,
  AlgoliaSearchCoursesService,
  AlgoliaSearchBlogsService,
  GetPopularAlgoliaFacetsService,
  MongoCourse,
  CommentOrQuestionResponse,
  MongoQuestion,
  PerformanceMonitorDecorator,
  NativeTimer,
  ExceptionParserDecorator,
  baseExceptionParser,
  InjectAlgoliaInsights,
} from '@app/core';
import { Auth, CurrentUser } from './auth/infrastructure/decorators';
import { Credentials } from './auth/application/models/credentials.model';
import { CreateCommentCommandHandler } from './comment/application/commands/create-comment/create-comment.command-handler';
import { CreateQuestionCommandHandler } from './course/application/commands';

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
    private readonly searchCoursesService: AlgoliaSearchCoursesService,
    private readonly searchBlogsService: AlgoliaSearchBlogsService,
    @Inject(LOGGER)
    private readonly logger: ILogger,
    private readonly searchTagsService: GetPopularAlgoliaFacetsService,
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
    @InjectModel(MongoQuestion.name)
    private readonly questionModel: Model<MongoQuestion>,
    @InjectAlgoliaInsights()
    private readonly algolia: InsightsClient,
  ) {}

  @Get('health')
  health() {
    this.rmqClient.emit('health', {});
    return 'Health check sent';
  }

  @Get('search/all')
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
    @Query('tag', new DefaultValuePipe([]), ParseArrayPipe)
    tagParam: string[] = [],
  ): Promise<SearchResponse> {
    const tags = tagParam.map((tag) => {
      const tagParts = tag.split('(');
      return tagParts[0].trim();
    });
    let operationName = 'Search Courses';
    const searchCoursesService = new LoggingDecorator(
      new PerformanceMonitorDecorator(
        this.searchCoursesService,
        new NativeTimer(),
        this.logger,
        operationName,
      ),
      this.logger,
      operationName,
    );
    operationName = 'Search Blogs';
    const searchBlogsService = new LoggingDecorator(
      new PerformanceMonitorDecorator(
        this.searchBlogsService,
        new NativeTimer(),
        this.logger,
        operationName,
      ),
      this.logger,
      operationName,
    );
    const [coursesResult, blogsResult] = await Promise.all([
      searchCoursesService.execute({
        searchTerm: searchTerm === '' ? ' ' : searchTerm,
        limit: perPage,
        page,
        tags,
      }),
      searchBlogsService.execute({
        searchTerm: searchTerm === '' ? ' ' : searchTerm,
        limit: perPage,
        page,
        tags,
      }),
    ]);
    const courseHits = coursesResult.unwrap();
    const blogHits = blogsResult.unwrap();
    return {
      courses: courseHits.map((hit) => ({
        id: hit.id,
        title: hit.name,
        category: hit.category,
        trainer: hit.instructor,
        image: hit.image,
      })),
      blogs: blogHits.map((hit) => ({
        id: hit.id,
        title: hit.title,
        category: hit.category,
        trainer: hit.instructor,
        image: hit.image,
      })),
    };
  }

  @Get('search/popular/tags')
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
  async getTags(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('perPage', new DefaultValuePipe(3), ParseIntPipe)
    perPage: number = 8,
  ): Promise<string[]> {
    return (await this.searchTagsService.execute({ page, perPage })).unwrap();
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
    type: [CommentOrQuestionResponse],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllComments(
    @CurrentUser() credentials: Credentials,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
    @Query('blog') blog?: string,
    @Query('lesson') lesson?: string,
    @Query('sort') sort?: 'LIKES' | 'DATE',
  ): Promise<CommentOrQuestionResponse[]> {
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
          limit: perPage,
          sort: sort === 'DATE' ? { publishDate: -1 } : { numberOfLikes: -1 },
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
    const questions = await this.questionModel.find(
      {
        lesson,
      },
      null,
      {
        skip: (page - 1) * perPage,
        limit: perPage,
        sort: {
          publishDate: -1,
        },
      },
    );
    return questions.map((question) => ({
      id: question.id,
      body: question.content,
      date: question.publishDate,
      user: question.publisher.name,
      userImage: question.publisher.image,
      ...(question.answer && {
        answer: {
          id: question.answer.id,
          answer: question.answer.answer,
          date: question.answer.date,
          instructor: {
            id: question.answer.instructor.id,
            name: question.answer.instructor.name,
            image: question.answer.instructor.image,
          },
        },
      }),
    }));
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
      const operationName = 'Create Comment';
      const service = new ExceptionParserDecorator(
        new LoggingDecorator(
          new PerformanceMonitorDecorator(
            new CreateCommentCommandHandler(
              this.uuidGenerator,
              this.eventStore,
            ),
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
        blog: createCommentDto.target,
        content: createCommentDto.body,
        publisher: credentials.userId,
      });
      return result.unwrap();
    }
    const operationName = 'Create Question';
    const service = new ExceptionParserDecorator(
      new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new CreateQuestionCommandHandler(this.uuidGenerator, this.eventStore),
          new NativeTimer(),
          this.logger,
          operationName,
        ),
        this.logger,
        operationName,
      ),
      baseExceptionParser,
    );
    const course = await this.courseModel.findOne({
      'lessons.id': createCommentDto.target,
    });
    if (!course) throw new NotFoundException('Course not found');
    const result = await service.execute({
      content: createCommentDto.body,
      user: credentials.userId,
      courseId: course.id,
      lesson: createCommentDto.target,
    });
    return result.unwrap();
  }

  @Post('click/:id')
  @Auth()
  async click(
    @Param('id') id: string,
    @CurrentUser() credentials: Credentials,
  ) {
    this.algolia('clickedObjectIDs', {
      eventName: 'Course Clicked',
      index: 'course',
      userToken: credentials.userId,
      objectIDs: [id],
    });
  }
}
