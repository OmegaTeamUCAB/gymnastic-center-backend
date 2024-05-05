import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdGenerator, IdResponse, UUIDGENERATOR } from '@app/core';
import { COURSE_REPOSITORY } from '../constants';
import { CourseRepository } from '../../domain';
import { CourseResponse } from './responses/course.response';
import {
  CommentLessonCommand,
  CreateCourseCommand,
  GetCourseByIdQuery,
  GetCoursesByCategoryQuery,
  GetCoursesByInstructorQuery,
  GetCoursesQuery,
  UpdateCourseCommand,
} from '../../application';
import { CommentLessonDto, CreateCourseDto, UpdateCourseDto } from './dtos';

@Controller('courses')
@ApiTags('Courses')
export class CourseController {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Courses list',
    type: [CourseResponse],
  })
  async getCategories() {
    const service = new GetCoursesQuery(this.courseRepository);
    const result = await service.execute();
    return result.unwrap();
  }

  @Get('category/:id')
  @ApiResponse({
    status: 200,
    description: 'Courses by category',
    type: [CourseResponse],
  })
  async getCoursesByCategory(@Param('id', ParseUUIDPipe) categoryId: string) {
    const service = new GetCoursesByCategoryQuery(this.courseRepository);
    const result = await service.execute({ categoryId });
    return result.unwrap();
  }

  @Get('instructor/:id')
  @ApiResponse({
    status: 200,
    description: 'Courses by instructor',
    type: [CourseResponse],
  })
  async getCoursesByInstruvtor(
    @Param('id', ParseUUIDPipe) instructorId: string,
  ) {
    const service = new GetCoursesByInstructorQuery(this.courseRepository);
    const result = await service.execute({ instructorId });
    return result.unwrap();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Course found',
    type: CourseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  async getCourseById(@Param('id', ParseUUIDPipe) id: string) {
    const service = new GetCourseByIdQuery(this.courseRepository);
    const result = await service.execute({ id });
    return result.unwrap();
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Course created',
    type: IdResponse,
  })
  async createCategory(@Body() createCategoryDto: CreateCourseDto) {
    const service = new CreateCourseCommand(
      this.courseRepository,
      this.uuidGenerator,
    );
    const result = await service.execute(createCategoryDto);
    return result.unwrap();
  }

  @Post('comment')
  @ApiResponse({
    status: 200,
    description: 'Comment added',
    type: IdResponse,
  })
  async commentLesson(@Body() commentLessonDto: CommentLessonDto) {
    const service = new CommentLessonCommand(
      this.courseRepository,
      this.uuidGenerator,
    );
    const result = await service.execute(commentLessonDto);
    const { commentId } = result.unwrap();
    return {
      id: commentId,
    };
  }

  @Post(':id')
  @ApiResponse({
    status: 200,
    description: 'Course updated',
    type: IdResponse,
  })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCourseDto,
  ) {
    const service = new UpdateCourseCommand(this.courseRepository);
    const result = await service.execute({ id, ...updateCategoryDto });
    return result.unwrap();
  }
}
