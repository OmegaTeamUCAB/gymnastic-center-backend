import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type InstructorDocument = HydratedDocument<MongoInstructor>;

@Schema({ collection: 'trainers', timestamps: false, versionKey: false })
export class MongoInstructor {
  readonly _id: string;

  @Prop({
    type: SchemaTypes.UUID,
    required: true,
    unique: true,
  })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: 0 })
  followerCount: number;

  @Prop({ type: [SchemaTypes.UUID], default: [] })
  followers: string[];
}

export const InstructorSchema = SchemaFactory.createForClass(MongoInstructor);
InstructorSchema.index({ id: 1 });
InstructorSchema.index({ followerCount: -1 });
