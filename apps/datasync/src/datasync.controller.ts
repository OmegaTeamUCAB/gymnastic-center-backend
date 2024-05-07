import { COURSE_CREATED, RabbitMQService } from '@app/core';
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
      const [category, instructor] = await Promise.all([
        this.connection.collection('categories').findOne({
          aggregateId: course.categoryId,
        }),
        this.connection.collection('instructors').findOne({
          aggregateId: course.instructorId,
        }),
      ]);
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
      this.logger.error(COURSE_CREATED, error);
    }
  }
}
