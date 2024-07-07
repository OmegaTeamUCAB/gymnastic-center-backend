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
import { GetUserFollowsQuery, GetUserInformationQuery } from './queries';
import { MongoUserRepository } from './repositories/mongo-user.repository';
import { USER_REPOSITORY } from './constants';

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
  providers: [
    GetUserInformationQuery,
    GetUserFollowsQuery,
    MongoUserRepository,
    {
      provide: 'USER_REPOSITORY',
      useClass: MongoUserRepository,
    },
  ],
  exports: [MongooseModule, USER_REPOSITORY],
})
export class UserModule {}
