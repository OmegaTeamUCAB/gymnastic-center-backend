import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoAuthUser, AuthUserSchema } from './models/mongo-auth-user.model';
import { AuthController } from './controllers/auth.controller';
import {
  AUTH_REPOSITORY,
  CODE_GENERATOR,
  JWT_SERVICE,
  VERIFICATION_EMAIL_HANDLER,
} from './constants';
import { MongoAuthRepository } from './repositories/mongo-auth.repository';
import { BcryptModule, UUIDModule } from '@app/core';
import {
  FourDigitCodeGeneratorService,
  JwtGenerator,
  JwtStrategy,
  VerificationCodeEmailService,
} from './providers';
import { UserModule } from '../../user/infrastructure';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, UserModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET is not defined');
        return {
          secret,
          signOptions: { expiresIn: '1y' },
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
    UserModule
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
    {
      provide: CODE_GENERATOR,
      useClass: FourDigitCodeGeneratorService,
    },
    {
      provide: VERIFICATION_EMAIL_HANDLER,
      useClass: VerificationCodeEmailService,
    },
  ],
})
export class AuthModule {}
