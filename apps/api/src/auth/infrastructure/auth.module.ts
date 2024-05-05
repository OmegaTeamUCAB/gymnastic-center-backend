import { Module } from '@nestjs/common';
import { MongoAuthUser, AuthUserSchema } from './models/mongo-auth-user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoAuthUser.name,
        schema: AuthUserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AuthUserRepository',
      useClass: MongoAuthUser,
    },
  ],
})
export class AuthModule {}
