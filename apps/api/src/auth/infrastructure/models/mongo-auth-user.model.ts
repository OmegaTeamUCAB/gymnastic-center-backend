import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthUserDocument = HydratedDocument<MongoAuthUser>;

@Schema({ timestamps: true, versionKey: false })
export class MongoAuthUser {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  aggregateId: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}

export const AuthUserSchema = SchemaFactory.createForClass(MongoAuthUser);
