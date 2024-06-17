import { Controller, Inject } from '@nestjs/common';
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
import { MongoBlog } from '@app/core/infrastructure/models/mongo-blog.model';

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
    @InjectModel(MongoBlog.name)
    private readonly blogModel: Model<MongoBlog>,
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

  @EventPattern('BlogCreated')
  async onBlogCreated(
    @Payload()
    data: EventType<{
      title: string;
      content: string;
      creationDate: Date;
      images: string[];
      tags: string[];
      category: string;
      instructor: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const [category, instructor] = await Promise.all([
        this.categoryModel.findOne({ id: data.context.category }),
        this.instructorModel.findOne({ id: data.context.instructor }),
      ]);
      if (!category || !instructor) {
        //this.rmqService.nack(context);
        return;
      }
      const {
        title,
        content,
        creationDate,
        images,
        tags,
      } = data.context;
      await this.blogModel.create({
        id: data.dispatcherId,
        title,
        content,
        uploadDate: creationDate,
        images,
        tags,
        category: { id: category.id, name: category.name },
        trainer: { id: instructor.id, name: category.name },
        categoryId: category,
        trainerId: instructor,
      });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogTitleUpdated')
  async onBlogTitleUpdated(
    @Payload()
    data: EventType<{
      title: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { title } = data.context;
      await this.blogModel.updateOne({ id: data.dispatcherId }, { title });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogContentUpdated')
  async onBlogContentUpdated(
    @Payload()
    data: EventType<{
      content: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { content } = data.context;
      await this.blogModel.updateOne({ id: data.dispatcherId }, { content });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogImagesUpdated')
  async onBlogImagesUpdated(
    @Payload()
    data: EventType<{
      images: string[];
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { images } = data.context;
      await this.blogModel.updateOne({ id: data.dispatcherId }, { images });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogTagsUpdated')
  async onBlogTagsUpdated(
    @Payload()
    data: EventType<{
      tags: string[];
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { tags } = data.context;
      await this.blogModel.updateOne({ id: data.dispatcherId }, { tags });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogCategoryUpdated')
  async onBlogCategoryUpdated(
    @Payload()
    data: EventType<{
      category: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { category } = data.context;
      await this.blogModel.updateOne({ id: data.dispatcherId }, { category });
      this.rmqService.ack(context);
    } catch (error) {}
  }
}
