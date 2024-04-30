import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class ApiController {
  constructor(
    @Inject('EVENTS')
    private readonly rmqClient: ClientProxy,
  ) {}

  @Get('health')
  health() {
    this.rmqClient.emit('health', {});
    return 'Health check sent';
  }
}
