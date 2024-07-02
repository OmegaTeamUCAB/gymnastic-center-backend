import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { AuthModule } from '../../auth/infrastructure';
import {
  BcryptModule,
  EventStoreModule,
  LoggerModule,
  UUIDModule,
  MongoUser,
  UserSchema,
} from '@app/core';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoUser.name,
        schema: UserSchema,
      },
    ]),
    AuthModule,
    BcryptModule,
    UUIDModule,
    EventStoreModule,
    LoggerModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
