import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, MongoEvent } from './models/mongo-event.model';
import { MongoEventProvider } from './providers/mongo-event-provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MongoEvent.name, schema: EventSchema }]),
  ],
  providers: [MongoEventProvider],
  exports: [MongoEventProvider],
})
export class EventReplayModule {}
