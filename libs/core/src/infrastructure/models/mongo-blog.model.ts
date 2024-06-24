import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type MongoBlogDocument = HydratedDocument<MongoBlog>;

@Schema({ collection: 'blogs', timestamps: false, versionKey: false })
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

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  uploadDate: Date;

  @Prop({ required: true, default: [], type: [String] })
  tags: string[];

  @Prop({
    type: { id: SchemaTypes.UUID, name: String, image: String, _id: false },
    required: true,
  })
  category: { id: string; name: string; image?: string };

  @Prop({
    type: { id: SchemaTypes.UUID, name: String, image: String, _id: false },
    required: true,
  })
  trainer: { id: string; name: string; image?: string };

  @Prop({ required: true, default: 0 })
  comments: number;
}

export const BlogSchema = SchemaFactory.createForClass(MongoBlog);
BlogSchema.index({ id: 1 });
BlogSchema.index({ 'category.id': 1 });
BlogSchema.index({ 'trainer.id': 1 });
BlogSchema.index({ comments: -1 });
BlogSchema.index({ uploadDate: -1 });
