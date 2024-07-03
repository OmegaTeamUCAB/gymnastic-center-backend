import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import {
  EVENT_STORE,
  EventStore,
  ILogger,
  IdResponse,
  LOGGER,
  LoggingDecorator,
  MongoProgress,
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

@Controller('progress')
@ApiTags('Progress')
@Auth()
export class ProgressController {
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOGGER)
    private readonly logger: ILogger,
    @InjectModel(MongoProgress.name)
    private readonly progressModel: Model<MongoProgress>,
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
    const service = new LoggingDecorator(
      new StartCourseCommandHandler(this.eventStore),
      this.logger,
      'Start Course',
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
    const service = new LoggingDecorator(
      new WatchLessonCommandHandler(this.eventStore),
      this.logger,
      'Watch Lesson',
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
    const progress = await this.progressModel.findOne({
      courseId,
      userId: credentials.userId,
    });
    if (!progress) throw new NotFoundException('Progress not found');
    return {
      percent: progress.percent,
      lessons: progress.lessons.map((lesson) => ({
        lessonId: lesson.id,
        time: lesson.time,
        percent: lesson.percent,
      })),
    };
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
    const progress = await this.progressModel.findOne(
      {
        userId: credentials.userId,
      },
      undefined,
      { sort: { lastTime: -1 } },
    );
    if (!progress) throw new NotFoundException('Progress not found');
    return {
      percent: progress.percent,
      courseId: progress.courseId,
      courseTitle: progress.title,
      lastTime: progress.lastTime,
    };
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
    const progress = await this.progressModel.find(
      {
        userId: credentials.userId,
      },
      undefined,
      { skip: (page - 1) * perPage, limit: perPage, sort: { lastTime: -1 } },
    );
    return progress.map((p) => ({
      id: p.courseId,
      percent: p.percent,
      title: p.title,
      image: p.image,
      date: p.publishDate,
      category: p.category.name,
      trainer: p.trainer.name,
    }));
  }
}