import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type CategoryDocument = HydratedDocument<MongoCategory>;

@Schema({ collection: 'categories', timestamps: false, versionKey: false })
export class MongoCategory {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.UUID,
  })
  id: string;

  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  icon: string;
}

export const CategorySchema = SchemaFactory.createForClass(MongoCategory);
