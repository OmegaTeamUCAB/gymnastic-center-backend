import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { EventStore } from '@app/core/application';
import { DomainEvent } from '@app/core/domain';
import { MongoEvent } from '../models/mongo-event.model';
import { Result } from '@app/core/utils';
import { EVENTS_QUEUE } from '../../rabbitmq';

@Injectable()
export class MongoEventStore
  implements EventStore, OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @InjectModel(MongoEvent.name)
    private readonly eventStore: Model<MongoEvent>,
    @Inject(EVENTS_QUEUE)
    private readonly rmqClient: ClientProxy,
  ) {}

  private changeStream: mongo.ChangeStream;

  async appendEvents(
    stream: string,
    events: DomainEvent[],
  ): Promise<Result<void>> {
    const session = await this.eventStore.startSession();
    const serializedEvents: MongoEvent[] = events.map((event) => {
      return {
        stream: stream,
        type: event.name,
        date: event.timestamp,
        context: event.context,
      };
    });
    try {
      session.startTransaction();
      await this.eventStore.insertMany(serializedEvents, {
        session,
        ordered: true,
      });
      await session.commitTransaction();
      return Result.success(null);
    } catch (error) {
      await session.abortTransaction();
      return Result.failure(error);
    } finally {
      await session.endSession();
    }
  }

  async getEventsByStream(stream: string): Promise<DomainEvent[]> {
    const events = await this.eventStore.find({ stream }).sort({ date: 1 });
    return events.map((event) => ({
      dispatcherId: event.stream,
      name: event.type,
      timestamp: event.date,
      context: event.context,
    }));
  }

  onApplicationBootstrap() {
    this.changeStream = this.eventStore.watch().on('change', (change) => {
      if (change.operationType === 'insert') {
        const event: MongoEvent = change.fullDocument;
        this.rmqClient.emit(event.type, {
          dispatcherId: event.stream,
          context: event.context,
          name: event.type,
        });
      }
    });
  }

  onApplicationShutdown() {
    return this.changeStream.close();
  }
}
