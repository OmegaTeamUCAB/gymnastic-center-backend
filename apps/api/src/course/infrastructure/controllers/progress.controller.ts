import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { Auth, CurrentUser } from 'apps/api/src/auth/infrastructure/decorators';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import {
  StartCourseCommandHandler,
  WatchLessonCommandHandler,
} from '../../application';
import { WatchCourseDto } from './dtos';
import {
  ProgressLeanResponse,
  ProgressResponse,
  TrendingProgressResponse,
} from './responses';
import {
  GetCourseProgressQuery,
  GetLastWatchedCoursesQuery,
  GetWatchingCoursesQuery,
} from '../queries';

@Controller('progress')
@ApiTags('Progress')
@Auth()
export class ProgressController {
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOGGER)
    private readonly logger: ILogger,
    private readonly getCourseProgressQuery: GetCourseProgressQuery,
    private readonly getLastWatchedCoursesQuery: GetLastWatchedCoursesQuery,
    private readonly getWatchingCoursesQuery: GetWatchingCoursesQuery,
  ) {}

  @Post('start/:courseId')
  @ApiResponse({
    status: 200,
    description: 'Course started',
    type: IdResponse,
  })
  async startCourse(
    @CurrentUser() credentials: Credentials,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<IdResponse> {
    const operationName = 'Start Course';
    const service = new ExceptionParserDecorator(
      new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new StartCourseCommandHandler(this.eventStore),
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
      courseId,
      userId: credentials.userId,
    });
    return { id: result.unwrap().courseId };
  }

  @Post('mark/end')
  @ApiResponse({
    status: 200,
    description: 'Course progress updated',
    type: IdResponse,
  })
  async watchCourse(
    @CurrentUser() credentials: Credentials,
    @Body() watchCourseDto: WatchCourseDto,
  ): Promise<IdResponse> {
    const { courseId, lessonId, markAsCompleted, time, totalTime } =
      watchCourseDto;
    const operationName = 'Watch Lesson';
    const service = new ExceptionParserDecorator(
      new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new WatchLessonCommandHandler(this.eventStore),
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
      courseId,
      lessonId,
      markAsCompleted,
      lastSecondWatched: time,
      totalSeconds: totalTime,
      userId: credentials.userId,
    });
    return { id: result.unwrap().courseId };
  }

  @Get('one/:courseId')
  @ApiResponse({
    status: 200,
    description: 'Course progress',
    type: ProgressResponse,
  })
  async getCourseProgress(
    @CurrentUser() credentials: Credentials,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<ProgressResponse> {
    return this.getCourseProgressQuery.execute({ credentials, courseId });
  }

  @Get('trending')
  @ApiResponse({
    status: 200,
    description: 'Trending progress',
    type: TrendingProgressResponse,
  })
  async getLastWatchedCourse(
    @CurrentUser() credentials: Credentials,
  ): Promise<TrendingProgressResponse> {
    return this.getLastWatchedCoursesQuery.execute(credentials);
  }

  @Get('courses')
  @ApiResponse({
    status: 200,
    description: 'Watching courses',
    type: [ProgressLeanResponse],
  })
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
    description: 'Number of . DEFAULT = 1',
    type: Number,
  })
  async getWatchingCourses(
    @CurrentUser() credentials: Credentials,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
  ): Promise<ProgressLeanResponse[]> {
    return this.getWatchingCoursesQuery.execute({ credentials, perPage, page });
  }
}
