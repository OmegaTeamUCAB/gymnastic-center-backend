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

  @Prop({
    required: true,
    default: [],
    type: [String],
  })
  images: string[];

  @Prop({ required: true, minlength: 5 })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  uploadDate: Date;

  @Prop({ required: true, default: [], type: [String] })
  tags: string[];

  @Prop({ type: { id: SchemaTypes.UUID, name: String }, required: true })
  category: { id: string; name: string };

  @Prop({ type: { id: SchemaTypes.UUID, name: String }, required: true })
  trainer: { id: string; name: string };

  @Prop({ type: SchemaTypes.UUID, required: true })
  categoryId: string;

  @Prop({ type: SchemaTypes.UUID, required: true })
  trainerId: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(MongoBlog);