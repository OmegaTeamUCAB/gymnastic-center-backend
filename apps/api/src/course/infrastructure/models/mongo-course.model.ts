import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<MongoCourse>;

@Schema({ collection: 'courses', timestamps: true, versionKey: false })
export class MongoCourse {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  aggregateId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  level: number;

  @Prop({
    type: [String],
    required: true,
  })
  tags: string[];

  @Prop({ required: true })
  weeks: number;

  @Prop({ required: true })
  minutes: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true })
  instructorId: string;

  @Prop({ required: true })
  trainer: string;

  @Prop({ required: true })
  category: string;

  @Prop({
    type: [
      {
        _id: false,
        entityId: String,
        title: String,
        description: String,
        content: String,
        videoUrl: String,
        imageUrl: String,
        comments: [
          {
            _id: false,
            entityId: String,
            userId: String,
            comment: String,
            creationDate: Date,
          },
        ],
      },
    ],
    required: true,
  })
  lessons: LessonSchema[];

  @Prop({ required: true })
  creationDate: Date;

  @Prop({ required: true })
  lastUpdate: Date;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(MongoCourse);

export type LessonSchema = {
  entityId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  imageUrl?: string;
  comments: CommentSchema[];
};

export type CommentSchema = {
  entityId: string;
  userId: string;
  comment: string;
  creationDate: Date;
};
