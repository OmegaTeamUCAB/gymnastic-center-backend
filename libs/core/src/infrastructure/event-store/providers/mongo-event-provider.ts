import { DomainEvent } from '@app/core/domain';
import { MongoEvent } from '../models/mongo-event.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class MongoEventProvider {
  constructor(
    @InjectModel(MongoEvent.name)
    private readonly eventStore: Model<MongoEvent>,
  ) {}

  async getEvents(from?: Date, until?: Date): Promise<DomainEvent[]> {
    const events = await this.eventStore
      .find({
        ...(from ||
          (until && {
            date: {
              ...(from && { $gte: from }),
              ...(until && { $lte: until }),
            },
          })),
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
