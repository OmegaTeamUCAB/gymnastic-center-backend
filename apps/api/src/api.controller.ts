import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EVENTS_QUEUE,
  SearchBlogsReadModel,
  SearchCoursesReadModel,
  SearchResponse,
} from '@app/core';
import { ApiResponse } from '@nestjs/swagger';

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
  @ApiResponse({
    status: 200,
    description: 'Search matching courses and blogs',
    type: SearchResponse,
  })
  async search(@Param('searchTerm') searchTerm: string) {
    const [courses, blogs] = await Promise.all([
      this.searchCoursesReadModel.execute({ searchTerm }),
      this.searchBlogsReadModel.execute({ searchTerm }),
    ]);
    return {
      courses,
      blogs,
    };
  }
}
