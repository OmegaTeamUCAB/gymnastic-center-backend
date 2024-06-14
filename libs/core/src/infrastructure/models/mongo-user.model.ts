import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type UserDocument = HydratedDocument<MongoUser>;

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class MongoUser {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.UUID,
  })
  id: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  phone: string;

  @Prop({
    required: false,
  })
  image: string;

  createdAt: Date;

  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(MongoUser);
