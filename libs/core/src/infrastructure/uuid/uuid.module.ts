import { Module } from '@nestjs/common';
import { UUIDGENERATOR } from './constants';
import { UUIDService } from './providers/uuid.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: UUIDGENERATOR,
      useClass: UUIDService,
    },
  ],
})
export class UUIDModule {}
