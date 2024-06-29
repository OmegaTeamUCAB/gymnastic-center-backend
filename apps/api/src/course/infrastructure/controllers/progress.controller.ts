import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  EVENT_STORE,
  EventStore,
  ILogger,
  IdResponse,
  LOGGER,
  LoggingDecorator,
} from '@app/core';
import { Auth, CurrentUser } from 'apps/api/src/auth/infrastructure/decorators';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import {
  StartCourseCommandHandler,
  WatchLessonCommandHandler,
} from '../../application';
import { WatchCourseDto } from './dtos';

@Controller('progress')
@ApiTags('Progress')
@Auth()
export class CourseController {
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOGGER)
    private readonly logger: ILogger,
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
}
