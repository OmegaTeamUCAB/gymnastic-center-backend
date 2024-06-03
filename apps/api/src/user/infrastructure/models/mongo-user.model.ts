import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<MongoUser>;

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class MongoUser {
  @Prop({
    required: true,
    unique: true,
  })
  id: string;

  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  phoneNumber: string;

  @Prop({
    required: false,
  })
  image: string;

  createdAt: Date;

  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(MongoUser);
