import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, MongoEvent } from './models/mongo-event.model';
import { EVENT_STORE } from './constants';
import { MongoEventStore } from './providers/mongo-event-store';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: MongoEvent.name, schema: EventSchema }],
    ),
  ],
  providers: [
    {
      provide: EVENT_STORE,
      useClass: MongoEventStore,
    },
  ],
  exports: [EVENT_STORE],
})
export class EventStoreModule {}
