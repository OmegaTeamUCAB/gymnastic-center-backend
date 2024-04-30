import { RabbitMQService } from '@app/core';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class DatasyncController {
  constructor(
    private readonly rmqService: RabbitMQService,
  ) {}

  @EventPattern('health')
  async health(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Health check received', data);
    this.rmqService.ack(context);
  }
}
