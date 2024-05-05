import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoAuthUser, AuthUserSchema } from './models/mongo-auth-user.model';
import { AuthController } from './controllers/auth.controller';
import { AUTH_REPOSITORY, JWT_SERVICE } from './constants';
import { MongoAuthRepository } from './repositories/mongo-auth.repository';
import { BcryptModule, UUIDModule } from '@app/core';
import { JwtGenerator, JwtStrategy } from './providers';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET is not defined');
        return {
          secret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    MongooseModule.forFeature([
      {
        name: MongoAuthUser.name,
        schema: AuthUserSchema,
      },
    ]),
    BcryptModule,
    UUIDModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: JWT_SERVICE,
      useClass: JwtGenerator,
    },
    JwtStrategy,
    {
      provide: AUTH_REPOSITORY,
      useClass: MongoAuthRepository,
    },
  ],
})
export class AuthModule {}
