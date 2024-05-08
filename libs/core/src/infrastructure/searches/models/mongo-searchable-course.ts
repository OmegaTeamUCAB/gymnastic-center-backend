import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SearchableCourseDocument = HydratedDocument<MongoSearchableCourse>;

@Schema({
  collection: 'searchablecourses',
  timestamps: false,
  versionKey: false,
})
export class MongoSearchableCourse {
  readonly _id: string;

  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  tags: string;

  @Prop()
  imageUrl: string;

  @Prop()
  categoryName: string;

  @Prop()
  instructorName: string;
}

export const SearchableCourseSchema = SchemaFactory.createForClass(
  MongoSearchableCourse,
);
