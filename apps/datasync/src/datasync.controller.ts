import { COURSE_CREATED, COURSE_UPDATED, RabbitMQService } from '@app/core';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class DatasyncController {
  constructor(
    private readonly rmqService: RabbitMQService,
    @InjectConnection() private connection: Connection,
  ) {}
  private readonly logger: Logger = new Logger(DatasyncController.name);

  @EventPattern('health')
  async health(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Health check received', data);
    this.rmqService.ack(context);
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
}
