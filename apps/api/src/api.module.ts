import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { MailgunModule, RabbitMQModule } from '@app/core';
import { ApiController } from './api.controller';
import { AuthModule } from './auth/infrastructure/auth.module';

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
      }),
      envFilePath: './apps/api/.env',
    }),
    RabbitMQModule.registerClient({
      queue: 'EVENTS',
    }),
    MongooseModule.forRoot(process.env.MONGODB_CNN),
    MailgunModule.forRoot({
      key: process.env.MAILGUN_API_KEY,
    }),
    AuthModule,
  ],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
