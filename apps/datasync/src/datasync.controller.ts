import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MongoCategory,
  MongoInstructor,
  MongoUser,
  RabbitMQService,
} from '@app/core';
import { EventType } from './types';

@Controller()
export class DatasyncController {
  constructor(
    private readonly rmqService: RabbitMQService,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
    @InjectModel(MongoUser.name)
    private readonly userModel: Model<MongoUser>,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
  ) {}

  @EventPattern('health')
  async health(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Health check received', data);
    this.rmqService.ack(context);
  }

  @EventPattern('UserCreated')
  async onUserCreated(
    @Payload()
    data: EventType<{
      name: string;
      email: string;
      phone: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name, email, phone } = data.context;
      await this.userModel.create({
        id: data.dispatcherId,
        name,
        email,
        phone,
      });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('UserNameUpdated')
  async onUserNameUpdated(
    @Payload()
    data: EventType<{
      name: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name } = data.context;
      await this.userModel.updateOne({ id: data.dispatcherId }, { name });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('UserPhoneUpdated')
  async onUserPhoneUpdated(
    @Payload()
    data: EventType<{
      phone: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { phone } = data.context;
      await this.userModel.updateOne({ id: data.dispatcherId }, { phone });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('UserImageUpdated')
  async onUserImageUpdated(
    @Payload()
    data: EventType<{
      image: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { image } = data.context;
      await this.userModel.updateOne({ id: data.dispatcherId }, { image });
      this.rmqService.ack(context);
    } catch (error) {}
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

  @EventPattern('InstructorCreated')
  async onInstructorCreated(
    @Payload()
    data: EventType<{
      name: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name } = data.context;
      await this.instructorModel.create({
        id: data.dispatcherId,
        name,
        followerCount: 0,
        followers: [],
      });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('InstructorNameUpdated')
  async onInstructorNameUpdated(
    @Payload()
    data: EventType<{
      name: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name } = data.context;
      await this.instructorModel.updateOne({ id: data.dispatcherId }, { name });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('InstructorFollowed')
  async onInstructorFollowed(
    @Payload()
    data: EventType<{
      user: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { user } = data.context;
      await this.instructorModel.updateOne(
        { id: data.dispatcherId },
        { $push: { followers: user }, $inc: { followerCount: 1 } },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('InstructorUnfollowed')
  async onInstructorUnfollowed(
    @Payload()
    data: EventType<{
      user: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { user } = data.context;
      await this.instructorModel.updateOne(
        { id: data.dispatcherId },
        { $pull: { followers: user }, $inc: { followerCount: -1 } },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }
}
