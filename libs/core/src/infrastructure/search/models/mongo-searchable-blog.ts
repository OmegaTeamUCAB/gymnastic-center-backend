import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'searchableblogs', timestamps: false, versionKey: false })
export class MongoSearchableBlog {
  readonly _id: string;

  @Prop()
  id: string;

  @Prop()
  imageUrl: string;

  @Prop()
  title: string;

  @Prop()
  categoryName: string;

  @Prop()
  instructorName: string;

  @Prop()
  description: string;

  @Prop()
  content: string;

  @Prop({ default: [], type: [String] })
  tags: string[];

  readonly createdat: Date;
  readonly updatedAt: Date;
}

export const SearchableBlogSchema =
  SchemaFactory.createForClass(MongoSearchableBlog);
