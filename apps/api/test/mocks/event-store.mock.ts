import { DomainEvent, EventStore, Result } from '@app/core';

export class EventStoreMock implements EventStore {
  private events: DomainEvent[] = [];
  subscriptions = new Map<string, ((event: DomainEvent) => Promise<void>)[]>();

  async appendEvents(
    stream: string,
    events: DomainEvent[],
  ): Promise<Result<void>> {
    this.events = this.events.concat(events);
    for (const event of events) {
      const subscribers = this.subscriptions.get(event.name);
      if (subscribers)
        for (const subscriber of subscribers) {
          await subscriber(event);
        }
    }
    return Result.success(undefined);
  }

  async getEventsByStream(stream: string): Promise<DomainEvent[]> {
    return this.events.filter((e) => e.dispatcherId === stream);
  }

  subscribe(
    eventName: string,
    handler: (event: DomainEvent) => Promise<void>,
  ): { unsubscribe: () => void } {
    const subscribers = this.subscriptions.get(eventName) || [];
    subscribers.push(handler);
    this.subscriptions.set(eventName, subscribers);
    return {
      unsubscribe: () => {
        if (!this.subscriptions.has(eventName))
          this.subscriptions.set(eventName, []);
        this.subscriptions.get(eventName).push(handler);
        return {
          unsubscribe: () => {
            this.subscriptions.set(
              eventName,
              this.subscriptions.get(eventName).filter((cb) => cb !== handler),
            );
          },
        };
      },
    };
  }
}
