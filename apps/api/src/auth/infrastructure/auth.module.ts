import { Module } from '@nestjs/common';
import { AuthUser, AuthUserSchema } from './models/auth-user.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AuthUser.name,
        schema: AuthUserSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}