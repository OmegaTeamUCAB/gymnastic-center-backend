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
  CountResponse,
  EVENT_STORE,
  EventStore,
  ILogger,
  IdGenerator,
  IdResponse,
  LOGGER,
  LoggingDecorator,
  NativeTimer,
  PerformanceMonitorDecorator,
  UUIDGENERATOR,
} from '@app/core';
import { CreateCourseDto, UpdateCourseDto } from './dtos';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import { CourseLeanResponse, CourseResponse } from './responses';
import { MongoCourse } from '../../../../../../libs/core/src/infrastructure/models/mongo-course.model';
import { CourseNotFoundException } from '../../application/exceptions';
import {
  CreateCourseCommandHandler,
  UpdateCourseCommandHandler,
} from '../../application';

@Controller('course')
@ApiTags('Courses')
@Auth()
export class CourseController {
  constructor(
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
    @Inject(LOGGER)
    private readonly logger: ILogger,
  ) {}

  @Get('many')
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
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Course Sorting',
    type: String,
    enum: ['POPULAR', 'RECENT'],
  })
  @ApiQuery({
    name: 'trainer',
    required: false,
    description: 'Instructor id filter',
    type: String,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Category id filter',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Courses list',
    type: [CourseLeanResponse],
  })
  async getCourses(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
    @Query('filter') filter?: 'POPULAR' | 'RECENT',
    @Query('trainer') instructorId?: string,
    @Query('category') categoryId?: string,
  ): Promise<CourseLeanResponse[]> {
    const courses = await this.courseModel.find(
      {
        ...(instructorId && { 'trainer.id': instructorId }),
        ...(categoryId && { 'category.id': categoryId }),
      },
      null,
      {
        skip: (page - 1) * perPage,
        limit: perPage,
        sort: filter === 'POPULAR' ? { views: -1 } : { publishDate: -1 },
      },
    );
    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category.name,
      trainer: course.trainer.name,
      image: course.image,
      date: course.publishDate,
    }));
  }

  @Get('one/:id')
  @ApiResponse({
    status: 200,
    description: 'Course found',
    type: CourseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  async getCourseById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CourseResponse> {
    const course = await this.courseModel.findOne({ id });
    if (!course) throw new NotFoundException(new CourseNotFoundException());
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      tags: course.tags,
      durationMinutes: course.minutes,
      durationWeeks: course.weeks,
      image: course.image,
      date: course.publishDate,
      category: course.category.name,
      trainer: {
        id: course.trainer.id,
        name: course.trainer.name,
        image: course.trainer.image,
      },
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        content: lesson.description,
        video: lesson.video,
      })),
    };
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Course created',
    type: IdResponse,
  })
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    const operationName = 'Create Course';
    const service = new LoggingDecorator(
      new PerformanceMonitorDecorator(
        new CreateCourseCommandHandler(this.uuidGenerator, this.eventStore),
        new NativeTimer(),
        this.logger,
        operationName,
      ),
      this.logger,
      operationName,
    );
    const result = await service.execute({ ...createCourseDto });
    return result.unwrap();
  }

  @Post(':id')
  @ApiResponse({
    status: 200,
    description: 'Course updated',
    type: IdResponse,
  })
  async updateCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const operationName = 'Update Course';
    const service = new LoggingDecorator(
      new PerformanceMonitorDecorator(
        new UpdateCourseCommandHandler(this.eventStore),
        new NativeTimer(),
        this.logger,
        operationName,
      ),
      this.logger,
      operationName,
    );
    const result = await service.execute({ id, ...updateCourseDto });
    const response = result.unwrap();
    return response;
  }

  @Get('count')
  @ApiResponse({
    status: 200,
    description: 'Courses count',
    type: CountResponse,
  })
  @ApiQuery({
    name: 'trainer',
    required: false,
    description: 'Instructor id filter',
    type: String,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Category id filter',
    type: String,
  })
  async countCourses(
    @Query('trainer') instructorId?: string,
    @Query('category') categoryId?: string,
  ): Promise<CountResponse> {
    const count = await this.courseModel.countDocuments({
      ...(instructorId && { 'trainer.id': instructorId }),
      ...(categoryId && { 'category.id': categoryId }),
    });
    return {
      count,
    };
  }
}
