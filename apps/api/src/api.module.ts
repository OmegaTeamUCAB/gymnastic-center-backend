import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import {
  EVENTS_QUEUE,
  EVENT_STORE,
  EventStore,
  EventStoreModule,
  LoggerModule,
  RabbitMQModule,
  SearchModule,
  UUIDModule,
} from '@app/core';
import { ApiController } from './api.controller';
import { AuthModule } from './auth/infrastructure/auth.module';
import { UserModule } from './user/infrastructure/user.module';
import { InstructorModule } from './instructor/infrastructure/instructors.module';
import { CategoryModule } from './category/infrastructure';
import { CourseModule } from './course/infrastructure/course.module';
import { BlogModule } from './blog/infrastructure/blog.module';
import { CommentModule } from './comment/infrastructure';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationsModule } from './notifications/infrastructure/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_EVENTS_QUEUE: Joi.string().required(),
        MONGODB_CNN: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_FROM: Joi.string().required(),
        MAILGUN_DOMAIN: Joi.string().required(),
        VERIFICATION_EMAIL_TEMPLATE: Joi.string().required(),
        ALGOLIA_ID: Joi.string().required(),
        ALGOLIA_KEY: Joi.string().required(),
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_PRIVATE_KEY: Joi.string().required(),
        FIREBASE_CLIENT_EMAIL: Joi.string().required(),
      }),
      envFilePath: './apps/api/.env',
    }),
    RabbitMQModule.registerClient({
      queue: EVENTS_QUEUE,
    }),
    NotificationsModule,
    MongooseModule.forRoot(process.env.MONGODB_CNN),
    AuthModule,
    CategoryModule,
    UserModule,
    InstructorModule,
    BlogModule,
    CourseModule,
    SearchModule,
    CommentModule,
    UUIDModule,
    EventStoreModule,
    LoggerModule,
  ],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule implements OnApplicationBootstrap {
  constructor(
    @Inject(EVENTS_QUEUE)
    private readonly rmqClient: ClientProxy,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
  ) {}

  onApplicationBootstrap() {
    this.eventStore.subscribe('ALL', async (event) => {
      this.rmqClient.emit('event', event);
    });
  }
}
