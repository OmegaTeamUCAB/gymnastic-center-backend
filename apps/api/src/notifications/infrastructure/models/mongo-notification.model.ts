import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type MongoNotificationDocument = HydratedDocument<MongoNotification>;

@Schema({ collection: 'notifications', timestamps: false, versionKey: false })
export class MongoNotification {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.UUID,
  })
  id: string;

  @Prop({
    required: true,
    type: SchemaTypes.UUID,
  })
  user: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  read: boolean;
}

export const NotificationSchema =
  SchemaFactory.createForClass(MongoNotification);
NotificationSchema.index({ id: 1 });
NotificationSchema.index({ user: 1, date: -1 });
NotificationSchema.index({ user: 1, read: 1 });
