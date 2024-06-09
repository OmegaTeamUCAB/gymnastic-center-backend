import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type EventDocument = HydratedDocument<MongoEvent>;

@Schema({
  collection: 'events',
  timestamps: false,
  versionKey: false,
})
export class MongoEvent {
  @Prop({
    type: SchemaTypes.UUID,
    required: true,
    immutable: true,
  })
  stream: string;

  @Prop({
    required: true,
    immutable: true,
  })
  type: string;

  @Prop({
    type: SchemaTypes.Date,
    required: true,
    immutable: true,
  })
  date: Date;

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
    immutable: true,
  })
  context: Object;
}

export const EventSchema = SchemaFactory.createForClass(MongoEvent);
EventSchema.index({ stream: 1, date: 1 });
