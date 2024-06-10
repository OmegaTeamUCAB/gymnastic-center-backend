import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  BLOG_CREATED,
  BLOG_UPDATED,
  COURSE_CREATED,
  COURSE_UPDATED,
  MongoCategory,
  RabbitMQService,
} from '@app/core';
import { EventType } from './types';

@Controller()
export class DatasyncController {
  constructor(
    private readonly rmqService: RabbitMQService,
    @InjectConnection() private connection: Connection,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
  ) {}
  private readonly logger: Logger = new Logger(DatasyncController.name);

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

  @EventPattern(COURSE_CREATED)
  async onCourseCreated(
    @Payload() data: { id: string },
    @Ctx() context: RmqContext,
  ) {
    try {
      const course = await this.connection
        .collection('courses')
        .findOne({ aggregateId: data.id });
      if (!course) throw new Error('Course not found');
      const [category, instructor] = await Promise.all([
        this.connection.collection('categories').findOne({
          aggregateId: course.categoryId,
        }),
        this.connection.collection('instructors').findOne({
          aggregateId: course.instructorId,
        }),
      ]);
      if (!category) throw new Error('Category not found');
      if (!instructor) throw new Error('Instructor not found');
      await this.connection.collection('searchablecourses').insertOne({
        id: data.id,
        title: course.title,
        description: course.description,
        categoryName: category.name,
        instructorName: `${instructor.name} ${instructor.lastName}`,
        tags: course.tags.join(' '),
        imageUrl: course.imageUrl,
      });
      this.rmqService.ack(context);
    } catch (error) {
      this.logger.error(COURSE_CREATED, data, error);
    }
  }

  @EventPattern(COURSE_UPDATED)
  async onCourseUpdated(
    @Payload() data: { id: string; dto: any },
    @Ctx() context: RmqContext,
  ) {
    try {
      let category;
      if (data.dto.categoryId) {
        category = await this.connection.collection('categories').findOne({
          aggregateId: data.dto.categoryId,
        });
        if (!category) throw new Error('Category not found');
      }
      await this.connection.collection('searchablecourses').updateOne(
        {
          id: data.id,
        },
        {
          $set: {
            ...(data.dto.title && { title: data.dto.title }),
            ...(data.dto.description && { description: data.dto.description }),
            ...(category && { categoryName: category.name }),
            ...(data.dto.tags && { tags: data.dto.tags.join(' ') }),
            ...(data.dto.imageUrl && { imageUrl: data.dto.imageUrl }),
          },
        },
      );
      this.rmqService.ack(context);
    } catch (error) {
      this.logger.error(COURSE_UPDATED, data, error);
    }
  }

  @EventPattern(BLOG_CREATED)
  async onBlogCreated(
    @Payload() data: { id: string },
    @Ctx() context: RmqContext,
  ) {
    try {
      const blog = await this.connection
        .collection('blogs')
        .findOne({ aggregateId: data.id });
      if (!blog) throw new Error('Blog not found');
      const [category, instructor] = await Promise.all([
        this.connection.collection('categories').findOne({
          aggregateId: blog.categoryId,
        }),
        this.connection.collection('instructors').findOne({
          aggregateId: blog.instructorId,
        }),
      ]);
      if (!category) throw new Error('Category not found');
      if (!instructor) throw new Error('Instructor not found');
      await this.connection.collection('searchableblogs').insertOne({
        id: data.id,
        title: blog.title,
        description: blog.description,
        categoryName: category.name,
        instructorName: `${instructor.name} ${instructor.lastName}`,
        tags: blog.tags.join(' '),
        imageUrl: blog.imageUrl,
        content: blog.content,
      });
      this.rmqService.ack(context);
    } catch (error) {
      this.logger.error(BLOG_CREATED, data, error);
    }
  }

  @EventPattern(BLOG_UPDATED)
  async onBlogUpdated(
    @Payload() data: { id: string; dto: any },
    @Ctx() context: RmqContext,
  ) {
    try {
      let category;
      if (data.dto.categoryId) {
        category = await this.connection.collection('categories').findOne({
          aggregateId: data.dto.categoryId,
        });
        if (!category) throw new Error('Category not found');
      }
      await this.connection.collection('searchableblogs').updateOne(
        {
          id: data.id,
        },
        {
          $set: {
            ...(data.dto.title && { title: data.dto.title }),
            ...(data.dto.description && { description: data.dto.description }),
            ...(category && { categoryName: category.name }),
            ...(data.dto.tags && { tags: data.dto.tags.join(' ') }),
            ...(data.dto.imageUrl && { imageUrl: data.dto.imageUrl }),
            ...(data.dto.content && { content: data.dto.content }),
          },
        },
      );
      this.rmqService.ack(context);
    } catch (error) {
      this.logger.error(BLOG_UPDATED, data, error);
    }
  }
}
