import { Module } from '@nestjs/common';
import { LocalEventHandler } from './providers/local-event-handler';
import { LOCAL_EVENT_HANDLER } from './constants';

@Module({
  imports: [],
  providers: [
    {
      provide: LOCAL_EVENT_HANDLER,
      useValue: new LocalEventHandler(),
    },
  ],
  exports: [LOCAL_EVENT_HANDLER],
})
export class EventHandlerModule {}
