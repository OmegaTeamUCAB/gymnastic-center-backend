import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type CommentDocument = HydratedDocument<MongoComment>;

@Schema({ collection: 'comments', timestamps: false, versionKey: false })
export class MongoComment {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.UUID,
  })
  id: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  blog: string;

  @Prop({
    required: true,
  })
  publisher: string;

  @Prop({
    required: true,
  })
  publishDate: Date;

  @Prop({
    required: true,
  })
  likes: string[];

  @Prop({
    required: true,
  })
  dislikes: string[];

  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(MongoComment);
