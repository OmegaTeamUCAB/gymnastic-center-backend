import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventStore } from '@app/core/application/event-store/event-store';
import { DomainEvent } from '@app/core/domain';
import { MongoEvent } from '../models/mongo-event.model';
import { Result } from '@app/core/utils';

@Injectable()
export class MongoEventStore implements EventStore {
  constructor(
    @InjectModel(MongoEvent.name)
    private readonly eventStore: Model<MongoEvent>,
  ) {}

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

  async getEventsByStream(stream: string): Promise<Result<DomainEvent[]>> {
    const events = await this.eventStore.find({ stream }).sort({ date: 1 });
    return Result.success(
      events.map((event) => ({
        dispatcherId: event.stream,
        name: event.type,
        timestamp: event.date,
        context: event.context,
      })),
    );
  }

  async getEventsByDateRange(
    from?: Date,
    until: Date = new Date(),
  ): Promise<Result<DomainEvent[]>> {
    const events = await this.eventStore
      .find({
        date: {
          ...(from && { $gte: from }),
          $lte: until,
        },
      })
      .sort({ date: 1 });
    return Result.success(
      events.map((event) => ({
        dispatcherId: event.stream,
        name: event.type,
        timestamp: event.date,
        context: event.context,
      })),
    );
  }
}
