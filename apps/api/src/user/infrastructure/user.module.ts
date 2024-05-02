import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UUIDModule } from '@app/core/infrastructure/uuid/uuid.module';
import { UserController } from './controllers/user.controller';
import { USER_REPOSITORY } from './constants';
import { MongoUserRepository } from './repositories';
import { MongoUser, UserSchema } from './models/mongo-user.model';

@Module({
  imports: [
      MongooseModule.forFeature([{
        name: MongoUser.name,
        schema: UserSchema
      },
    ]),
    UUIDModule
  ],
  controllers: [UserController],
  providers: [
      {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    }
  ],
})
export class UserModule {}
