import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdGenerator, IdResponse, UUIDGENERATOR } from '@app/core';
import { COURSE_REPOSITORY } from '../constants';
import { CourseRepository } from '../../domain';
import {
  CreateCourseCommand,
  GetCourseByIdQuery,
  GetCoursesByCategoryQuery,
  GetCoursesByInstructorQuery,
  GetCoursesQuery,
  UpdateCourseCommand,
} from '../../application';
import { CreateCourseDto, UpdateCourseDto } from './dtos';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import { CourseLeanResponse, CourseResponse } from './responses';

@Controller('course')
@ApiTags('Courses')
@Auth()
export class CourseController {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
  ) {}

  @Get('many')
  @ApiResponse({
    status: 200,
    description: 'Courses list',
    type: [CourseLeanResponse],
  })
  async getCourses(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) limit: number,
    @Query('filter') filter?: 'POPULAR' | 'RECENT',
    @Query('trainer') trainer?: string,
    @Query('category') category?: string,
  ) {
    const byCategory = !!category;
    const byTrainer = !!trainer;
    if (byCategory) {
      const service = new GetCoursesByCategoryQuery(this.courseRepository);
      const result = await service.execute({ categoryId: category });
      return result.unwrap();
    }
    if (byTrainer) {
      const service = new GetCoursesByInstructorQuery(this.courseRepository);
      const result = await service.execute({ instructorId: trainer });
      return result.unwrap();
    }
    const service = new GetCoursesQuery(this.courseRepository);
    const result = await service.execute();
    return result.unwrap();
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
