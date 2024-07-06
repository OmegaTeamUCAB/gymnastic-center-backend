import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  ParseUUIDPipe,
  Query,
  Post,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateBlogCommandHandler,
  UpdateBlogCommandHandler,
} from '../../application';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
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
  UUIDGENERATOR,
  PerformanceMonitorDecorator,
} from '@app/core';
import { BlogLeanResponse, BlogResponse } from './responses';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import {
  GetAllBlogsQuery,
  GetBlogByIdQuery,
  GetBlogCountQuery,
} from '../queries';

@Controller('blog')
@ApiTags('Blogs')
@Auth()
export class BlogController {
  constructor(
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOGGER)
    private readonly logger: ILogger,
    private readonly getAllBlogsQuery: GetAllBlogsQuery,
    private readonly getBlogByIdQuery: GetBlogByIdQuery,
    private readonly getBlogCountQuery: GetBlogCountQuery,
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
    description: 'Blog Sorting',
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
    description: 'Blogs list',
    type: [BlogResponse],
  })
  async getAllBlogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
    @Query('filter') filter?: 'POPULAR' | 'RECENT',
    @Query('trainer') trainer?: string,
    @Query('category') category?: string,
  ): Promise<BlogLeanResponse[]> {
    return this.getAllBlogsQuery.execute({
      category,
      trainer,
      filter,
      page,
      perPage,
    });
  }

  @Get('one/:id')
  @ApiResponse({
    status: 200,
    description: 'Blog found',
    type: BlogResponse,
  })
  @Get('one/:id')
  async getBlogById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BlogResponse> {
    return this.getBlogByIdQuery.execute({ id });
  }

  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully created',
    type: IdResponse,
  })
  @Post()
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const operationName = 'Create Blog';
    const service = new LoggingDecorator(
      new PerformanceMonitorDecorator(
        new CreateBlogCommandHandler(this.uuidGenerator, this.eventStore),
        new NativeTimer(),
        this.logger,
        operationName,
      ),
      this.logger,
      operationName,
    );
    const result = await service.execute({
      ...createBlogDto,
    });
    return result.unwrap();
  }

  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully updated',
    type: IdResponse,
  })
  @Post(':id')
  @ApiResponse({
    status: 200,
    description: 'Blog updated',
    type: IdResponse,
  })
  async updateBlog(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const operationName = 'Update Blog';
    const service = new LoggingDecorator(
      new PerformanceMonitorDecorator(
        new UpdateBlogCommandHandler(this.eventStore),
        new NativeTimer(),
        this.logger,
        operationName,
      ),
      this.logger,
      operationName,
    );
    const result = await service.execute({ id, ...updateBlogDto });
    return result.unwrap();
  }

  @Get('count')
  @ApiResponse({
    status: 200,
    description: 'Blogs count',
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
    return this.getBlogCountQuery.execute({ instructorId, categoryId });
  }
}
