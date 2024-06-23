import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers';
import { AuthModule } from '../../auth/infrastructure';
import {
  BcryptModule,
  EventHandlerModule,
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
    EventHandlerModule,
    LoggerModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
