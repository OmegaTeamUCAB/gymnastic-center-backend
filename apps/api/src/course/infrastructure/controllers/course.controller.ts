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
  EventHandler,
  EventStore,
  IdGenerator,
  IdResponse,
  LOCAL_EVENT_HANDLER,
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
    @Inject(LOCAL_EVENT_HANDLER)
    private readonly localEventHandler: EventHandler,
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
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
        ...(instructorId && { instructorId }),
        ...(categoryId && { categoryId }),
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
    console.log("object");
    const service = new CreateCourseCommandHandler(
      this.uuidGenerator,
      this.eventStore,
      this.localEventHandler,
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
    const service = new UpdateCourseCommandHandler(
      this.eventStore,
      this.localEventHandler,
    );
    const result = await service.execute({ id, ...updateCourseDto });
    const response = result.unwrap();
    return response;
  }
}
