import { DomainEvent } from '@app/core/domain';
import { Result } from '@app/core/utils';

type Subscription = {
  unsubscribe: () => void;
};

export interface EventStore {
  appendEvents(stream: string, events: DomainEvent[]): Promise<Result<void>>;
  getEventsByStream(stream: string): Promise<DomainEvent[]>;
  subscribe(
    eventName: string,
    handler: (event: DomainEvent) => Promise<void>,
  ): Subscription;
}
