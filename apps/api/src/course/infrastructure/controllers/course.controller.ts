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
import { IdGenerator, IdResponse, UUIDGENERATOR } from '@app/core';
import { COURSE_REPOSITORY } from '../constants';
import { CourseRepository } from '../../domain';
import { CreateCourseCommand, UpdateCourseCommand } from '../../application';
import { CreateCourseDto, UpdateCourseDto } from './dtos';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import { CourseLeanResponse, CourseResponse } from './responses';
import { MongoCourse } from '../models/mongo-course.model';

@Controller('course')
@ApiTags('Courses')
@Auth()
export class CourseController {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
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
    description:
      'Course Sorting',
    type: String,
    enum: ['POPULAR', 'RECENT']
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
    @Query('perPage', new DefaultValuePipe(8) ,ParseIntPipe) perPage: number,
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
      },
    );
    return courses.map((course) => ({
      id: course.aggregateId,
      title: course.title,
      description: course.description,
      category: course.categoryId,
      trainer: course.instructorId,
      image: course.imageUrl,
      date: course.creationDate,
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
    const course = await this.courseModel.findOne({ aggregateId: id });
    if (!course) throw new NotFoundException('Course not found');
    return {
      id: course.aggregateId,
      title: course.title,
      description: course.description,
      level: course.level,
      tags: course.tags,
      durationMinutes: course.minutes,
      durationWeeks: course.weeks,
      image: course.imageUrl,
      date: course.creationDate,
      category: course.categoryId,
      trainer: {
        id: course.instructorId,
        name: 'John Doe',
      },
      lessons: course.lessons.map((lesson) => ({
        id: lesson.entityId,
        title: lesson.title,
        content: lesson.content,
        video: lesson.videoUrl,
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
    const service = new CreateCourseCommand(
      this.courseRepository,
      this.uuidGenerator,
    );
    const result = await service.execute(createCourseDto);
    const response = result.unwrap();
    return response;
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
    const service = new UpdateCourseCommand(this.courseRepository);
    const result = await service.execute({ id, ...updateCourseDto });
    const response = result.unwrap();
    return response;
  }
}
