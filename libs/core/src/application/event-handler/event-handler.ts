import { DomainEvent } from '@app/core/domain';

type Subscription = {
  unsubscribe: () => void;
};

export interface EventHandler {
  publishEvents(events: DomainEvent[]): void;
  subscribe(
    event: { new (...args: any[]): DomainEvent; eventName: string },
    callback: (event: DomainEvent) => Promise<void>,
  ): Subscription;
}
