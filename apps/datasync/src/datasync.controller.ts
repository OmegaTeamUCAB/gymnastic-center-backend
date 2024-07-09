import { Controller, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MongoEventProvider, RabbitMQService } from '@app/core';
import { EventType, Projector } from './types';
import { ConfigService } from '@nestjs/config';
import { AlgoliaEventsProjector } from './projectors/events/algolia-events.projector';

@Controller()
export class DatasyncController implements OnApplicationBootstrap {
  constructor(
    private readonly rmqService: RabbitMQService,
    private readonly eventProvider: MongoEventProvider,
    @Inject('PROJECTORS')
    private readonly projectors: Projector[],
    private readonly configService: ConfigService,
    private readonly algoliaEventsProjector: AlgoliaEventsProjector,
  ) {}

  async onApplicationBootstrap() {
    if (this.configService.get('REPLAY') === 'true') {
      const [events] = await Promise.all([
        this.eventProvider.getEvents(),
        ...this.projectors.map((p) => p.clear()),
      ]);
      for (const event of events)
        await Promise.all(this.projectors.map((p) => p.project(event)));
    }
  }

  @EventPattern('health')
  async health(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Health check received', data);
    this.rmqService.ack(context);
  }

  @EventPattern('event')
  async onEvent(@Payload() event: EventType, @Ctx() context: RmqContext) {
    await Promise.all(this.projectors.map((p) => p.project(event)));
    await this.algoliaEventsProjector.project(event);
    this.rmqService.ack(context);
  }
}
