import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CredentialsDocument = HydratedDocument<MongoCredentials>;

@Schema({ collection: 'credentials', timestamps: true, versionKey: false })
export class MongoCredentials {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  userId: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  verificationCode?: string;

  @Prop({ type: Date })
  codeExpirationDate?: Date;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}

export const CredentialsSchema = SchemaFactory.createForClass(MongoCredentials);
