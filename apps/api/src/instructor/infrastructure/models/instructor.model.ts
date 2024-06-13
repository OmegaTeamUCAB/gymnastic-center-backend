import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InstructorDocument = HydratedDocument<MongoInstructor>;

@Schema({ collection: 'instructors', timestamps: true, versionKey: false })
export class MongoInstructor {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  id: string;

  @Prop({ required: true, minlength: 1 })
  name: string;

  @Prop({ required: true, minlength: 1 })
  city: string;

  @Prop({ required: true, minlength: 1 })
  country: string;

  @Prop({ required: true })
  followers: number;

  @Prop({ required: true })
  userFollow: boolean;
}

export const InstructorSchema = SchemaFactory.createForClass(MongoInstructor);
