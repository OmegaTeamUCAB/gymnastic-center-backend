import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { USER_REPOSITORY } from './constants';
import { MongoUserRepository } from './repositories';
import { MongoUser, UserSchema } from './models/mongo-user.model';
import { AuthModule } from '../../auth/infrastructure';
import { BcryptModule, UUIDModule } from '@app/core';

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
  ],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
