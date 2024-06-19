import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type CourseDocument = HydratedDocument<MongoCourse>;

@Schema({ collection: 'courses', timestamps: false, versionKey: false })
export class MongoCourse {
  readonly _id: string;

  @Prop({
    type: SchemaTypes.UUID,
    unique: true,
    required: true,
  })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  level: number;

  @Prop({
    type: [String],
    required: true,
    default: [],
  })
  tags: string[];

  @Prop({ required: true })
  weeks: number;

  @Prop({ required: true })
  minutes: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  publishDate: Date;

  @Prop({ required: true, default: 0 })
  views: number;

  @Prop({
    type: { _id: false, id: SchemaTypes.UUID, name: String },
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
        id: SchemaTypes.UUID,
        title: String,
        description: String,
        video: String,
      },
    ],
    required: true,
  })
  lessons: {
    id: string;
    title: string;
    description: string;
    video: string;
  }[];
}

export const CourseSchema = SchemaFactory.createForClass(MongoCourse);
CourseSchema.index({ id: 1 });
CourseSchema.index({ 'category.id': 1 });
CourseSchema.index({ 'trainer.id': 1 });
CourseSchema.index({ publishDate: -1 });
CourseSchema.index({ views: -1 });
