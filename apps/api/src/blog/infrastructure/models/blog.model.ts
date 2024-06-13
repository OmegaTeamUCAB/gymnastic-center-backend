import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type MongoBlogDocument = HydratedDocument<MongoBlog>;

@Schema({ collection: 'blogs', timestamps: true, versionKey: false })
export class MongoBlog {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.UUID,
  })
  id: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true, minlength: 5 })
  title: string;

  @Prop({ required: true, minlength: 5 })
  description: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  uploadDate: Date;

  @Prop({
    required: true,
    default: [],
    type: [
      {
        _id: false,
        id: String,
        userId: String,
        blogId: String,
        content: String,
        postedAt: Date,
      },
    ],
  })
  comments: {
    id: string;
    userId: string;
    blogId: string;
    content: string;
    postedAt: Date;
  }[];

  @Prop({ required: true, default: [], type: [String] })
  tags: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  trainer: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(MongoBlog);