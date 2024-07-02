import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { EventStore } from '@app/core/application';
import { DomainEvent } from '@app/core/domain';
import { MongoEvent } from '../models/mongo-event.model';
import { Result } from '@app/core/utils';

@Injectable()
export class MongoEventStore
  implements EventStore, OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @InjectModel(MongoEvent.name)
    private readonly eventStore: Model<MongoEvent>,
  ) {}

  private changeStream: mongo.ChangeStream;
  private subscriptions: Map<
    string,
    ((event: DomainEvent) => Promise<void>)[]
  > = new Map().set('ALL', []);

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

  subscribe(
    eventName: string | 'ALL',
    handler: (event: DomainEvent) => Promise<void>,
  ): { unsubscribe: () => void } {
    if (!this.subscriptions.has(eventName))
      this.subscriptions.set(eventName, []);
    this.subscriptions.get(eventName).push(handler);
    return {
      unsubscribe: () => {
        this.subscriptions.set(
          eventName,
          this.subscriptions.get(eventName).filter((cb) => cb !== handler),
        );
      },
    };
  }

  onApplicationBootstrap() {
    this.changeStream = this.eventStore.watch().on('change', (change) => {
      if (change.operationType === 'insert') {
        const event: MongoEvent = change.fullDocument;
        const handlers = this.subscriptions
          .get('ALL')
          .concat(this.subscriptions.get(event.type));
        handlers.forEach((handler) =>
          handler({
            dispatcherId: event.stream,
            name: event.type,
            timestamp: event.date,
            context: event.context,
          }),
        );
      }
    });
  }

  onApplicationShutdown() {
    return this.changeStream.close();
  }
}
