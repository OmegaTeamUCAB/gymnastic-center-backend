import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type InstructorDocument = HydratedDocument<MongoInstructor>;

@Schema({ collection: 'instructors', timestamps: true, versionKey: false })
export class MongoInstructor {
  readonly _id: string;

  @Prop({
    type: SchemaTypes.UUID,
    required: true,
    unique: true,
  })
  id: string;

  @Prop({ required: true, minlength: 1 })
  name: string;

  @Prop({ required: true })
  followerCount: number;

  @Prop({ type: [SchemaTypes.UUID], required: true })
  followers: string[];
}

export const InstructorSchema = SchemaFactory.createForClass(MongoInstructor);
