import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type CredentialsDocument = HydratedDocument<MongoCredentials>;

@Schema({ collection: 'credentials', timestamps: true, versionKey: false })
export class MongoCredentials {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.UUID,
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

  @Prop({ default: [] })
  devices: string[];

  readonly createdAt: Date;

  readonly updatedAt: Date;
}

export const CredentialsSchema = SchemaFactory.createForClass(MongoCredentials);
