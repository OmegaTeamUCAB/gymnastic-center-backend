import {
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EVENTS_QUEUE,
  SearchBlogsReadModel,
  SearchCoursesReadModel,
  SearchResponse,
} from '@app/core';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

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

  @Get('search/:searchTerm')
  @ApiQuery({
    name: 'limit',
    required: false,
    description:
      'Number of results to return for each type of search. DEFAULT = 3',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Search matching courses and blogs',
    type: SearchResponse,
  })
  async search(
    @Param('searchTerm') searchTerm: string,
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number = 3,
  ) {
    const [courses, blogs] = await Promise.all([
      this.searchCoursesReadModel.execute({ searchTerm, limit }),
      this.searchBlogsReadModel.execute({ searchTerm, limit }),
    ]);
    return {
      courses,
      blogs,
    };
  }
}
