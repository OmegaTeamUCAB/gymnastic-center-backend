import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UUIDService } from '@app/core/infrastructure/uuid/providers/uuid.service';

export type AuthUserDocument = HydratedDocument<AuthUser>;

@Schema({ timestamps: true, versionKey: false })
export class AuthUser {
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

export const AuthUserSchema = SchemaFactory.createForClass(AuthUser);
