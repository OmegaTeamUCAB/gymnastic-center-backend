import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<MongoCategory>;

@Schema({ collection: 'categories', timestamps: true, versionKey: false })
export class MongoCategory {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  aggregateId: string;

  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  icon: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(MongoCategory);
