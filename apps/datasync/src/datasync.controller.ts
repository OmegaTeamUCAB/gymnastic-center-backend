import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoCategory, RabbitMQService } from '@app/core';
import { EventType } from './types';

@Controller()
export class DatasyncController {
  constructor(
    private readonly rmqService: RabbitMQService,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
  ) {}

  @EventPattern('health')
  async health(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Health check received', data);
    this.rmqService.ack(context);
  }

  @EventPattern('CategoryCreated')
  async onCategoryCreated(
    @Payload()
    data: EventType<{
      name: string;
      icon: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name, icon } = data.context;
      await this.categoryModel.create({ id: data.dispatcherId, name, icon });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CategoryNameUpdated')
  async onCategoryNameUpdated(
    @Payload()
    data: EventType<{
      name: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name } = data.context;
      await this.categoryModel.updateOne({ id: data.dispatcherId }, { name });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CategoryIconUpdated')
  async onCategoryIconUpdated(
    @Payload()
    data: EventType<{
      icon: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { icon } = data.context;
      await this.categoryModel.updateOne({ id: data.dispatcherId }, { icon });
      this.rmqService.ack(context);
    } catch (error) {}
  }
}
