import { NestFactory } from '@nestjs/core';
import { DatasyncModule } from './datasync.module';
import { RabbitMQService } from '@app/core';

async function bootstrap() {
  const app = await NestFactory.create(DatasyncModule);
  const rmqService = app.get<RabbitMQService>(RabbitMQService);
  app.connectMicroservice(rmqService.getOptions('EVENTS'));
  await app.startAllMicroservices();
}
bootstrap();
