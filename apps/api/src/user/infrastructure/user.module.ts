import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers';
import {
  MongoUser,
  UserSchema,
} from '../../../../../libs/core/src/infrastructure/models';
import { AuthModule } from '../../auth/infrastructure';
import {
  BcryptModule,
  EventHandlerModule,
  EventStoreModule,
  UUIDModule,
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
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
