import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventStore } from '@app/core/application/event-store/event-store';
import { DomainEvent } from '@app/core/domain';
import { MongoEvent } from '../models/mongo-event.model';

@Injectable()
export class MongoEventStore implements EventStore {
  constructor(
    @InjectModel(MongoEvent.name)
    private readonly eventStore: Model<MongoEvent>,
  ) {}

  async appendEvents(stream: string, events: DomainEvent[]): Promise<void> {
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
    } catch (error) {
      await session.abortTransaction();
      const UNIQUE_CONSTRAINT_ERROR_CODE = 11000;
      if (error?.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        //Events could not be persisted. Aggregate is stale
        console.error(error.writeErrors?.[0]?.err?.errmsg);
      } else {
        throw error;
      }
    } finally {
      await session.endSession();
    }
  }

  async getEventsByStream(stream: string): Promise<DomainEvent[]> {
    const events = await this.eventStore
      .find({ stream })
      .sort({ date: 1 });
    return events.map((event) => ({
      dispatcherId: event.stream,
      name: event.type,
      timestamp: event.date,
      context: event.context,
    }));
  }

  async getEventsByDateRange(
    from?: Date,
    until: Date = new Date(),
  ): Promise<DomainEvent[]> {
    const events = await this.eventStore
      .find({
        date: {
          ...(from && { $gte: from }),
          $lte: until,
        },
      })
      .sort({ date: 1 });
    return events.map((event) => ({
      dispatcherId: event.stream,
      name: event.type,
      timestamp: event.date,
      context: event.context,
    }));
  }
}
