import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { CategorySchema, MongoCategory, RabbitMQModule } from '@app/core';
import { DatasyncController } from './datasync.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_EVENTS_QUEUE: Joi.string().required(),
        MONGODB_CNN: Joi.string().required(),
      }),
      envFilePath: './apps/datasync/.env',
    }),
    RabbitMQModule,
    MongooseModule.forRoot(process.env.MONGODB_CNN),
    MongooseModule.forFeature([
      {
        name: MongoCategory.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [DatasyncController],
  providers: [],
})
export class DatasyncModule {}
