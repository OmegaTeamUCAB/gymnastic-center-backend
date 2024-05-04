import { Module } from '@nestjs/common';
import { BcryptService } from './providers/bcrypt.service';

@Module({
  imports: [],
  controllers: [],
  providers: [BcryptService],
})
export class BcryptModule {}