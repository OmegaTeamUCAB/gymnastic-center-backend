import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBITMQ_URI')],
        queue: this.configService.get<string>(
          `RABBITMQ_${queue.toUpperCase()}_QUEUE`,
        ),
        noAck,
        persistent: true,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  nack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.nack(originalMsg, false, false);
  }
}
