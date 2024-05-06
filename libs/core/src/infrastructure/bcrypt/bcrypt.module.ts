import { Module } from '@nestjs/common';
import { BcryptService } from './providers/bcrypt.service';
import { BCRYPT_SERVICE } from './constants';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: BCRYPT_SERVICE,
      useClass: BcryptService,
    },
  ],
  exports: [BCRYPT_SERVICE],
})
export class BcryptModule {}
