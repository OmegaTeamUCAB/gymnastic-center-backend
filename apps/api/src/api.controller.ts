import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SearchCoursesReadModel } from '@app/core';

@Controller()
export class ApiController {
  constructor(
    @Inject('EVENTS')
    private readonly rmqClient: ClientProxy,
    private readonly searchCoursesReadModel: SearchCoursesReadModel,
  ) {}

  @Get('health')
  health() {
    this.rmqClient.emit('health', {});
    return 'Health check sent';
  }

  @Get('search/:searchTerm')
  search(@Param('searchTerm') searchTerm: string) {
    return this.searchCoursesReadModel.execute({ searchTerm });
  }
}
