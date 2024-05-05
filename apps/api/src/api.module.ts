import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { RabbitMQModule } from '@app/core';
import { ApiController } from './api.controller';
import { AuthModule } from './auth/infrastructure/auth.module';
import { CategoryModule } from './category/infrastructure';
import { InstructorsModule } from './instructors/infraestructure/instructors.module';
import { BlogModule } from './blog/blog.module';
import { CourseModule } from './course/infrastructure/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_EVENTS_QUEUE: Joi.string().required(),
        MONGODB_CNN: Joi.string().required(),
      }),
      envFilePath: './apps/api/.env',
    }),
    RabbitMQModule.registerClient({
      queue: 'EVENTS',
    }),
    MongooseModule.forRoot(process.env.MONGODB_CNN),
    AuthModule,
    CategoryModule,
    InstructorsModule,
    BlogModule,
    CourseModule,
  ],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
