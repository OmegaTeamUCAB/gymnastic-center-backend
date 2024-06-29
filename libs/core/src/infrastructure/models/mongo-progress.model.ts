import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type ProgressDocument = HydratedDocument<MongoProgress>;

@Schema({ collection: 'courses', timestamps: false, versionKey: false })
export class MongoProgress {
  readonly _id: string;

  @Prop({
    type: SchemaTypes.UUID,
    required: true,
  })
  userId: string;

  @Prop({
    type: SchemaTypes.UUID,
    required: true,
  })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  publishDate: Date;

  @Prop({ required: true })
  lastTime: Date;

  @Prop({ required: true, default: 0 })
  percent: number;

  @Prop({
    type: { _id: false, id: SchemaTypes.UUID, name: String, image: String },
    required: true,
  })
  trainer: { id: string; name: string };

  @Prop({
    type: { _id: false, id: SchemaTypes.UUID, name: String },
    required: true,
  })
  category: { id: string; name: string };

  @Prop({
    type: [
      {
        _id: false,
        id: SchemaTypes.UUID,
        time: SchemaTypes.Number,
        percent: SchemaTypes.Number,
      },
    ],
    required: true,
  })
  lessons: {
    id: string;
    time: number;
    percent: number;
  }[];
}

export const ProgressSchema = SchemaFactory.createForClass(MongoProgress);
ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
ProgressSchema.index({ userId: 1, lastTime: -1 });
