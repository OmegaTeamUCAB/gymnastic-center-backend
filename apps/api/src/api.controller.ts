import {
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  EVENTS_QUEUE,
  SearchBlogsReadModel,
  SearchCoursesReadModel,
  SearchResponse,
} from '@app/core';
import { Auth } from './auth/infrastructure/decorators';

@Controller()
export class ApiController {
  constructor(
    @Inject(EVENTS_QUEUE)
    private readonly rmqClient: ClientProxy,
    private readonly searchCoursesReadModel: SearchCoursesReadModel,
    private readonly searchBlogsReadModel: SearchBlogsReadModel,
  ) {}

  @Get('health')
  health() {
    this.rmqClient.emit('health', {});
    return 'Health check sent';
  }

  @Get('search')
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
    description:
      'Number of . DEFAULT = 1',
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
    @Query('perPage', new DefaultValuePipe(3), ParseIntPipe) perPage: number = 3,
    @Query('tag', new DefaultValuePipe([]), ParseArrayPipe) tag: string[] = [],
  ) {
    const [courses, blogs] = await Promise.all([
      this.searchCoursesReadModel.execute({ searchTerm, limit: perPage }),
      this.searchBlogsReadModel.execute({ searchTerm, limit: perPage }),
    ]);
    return {
      courses,
      blogs,
    };
  }
}
