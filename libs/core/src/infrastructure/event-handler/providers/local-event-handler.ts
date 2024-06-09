import { EventHandler } from '@app/core/application';
import { DomainEvent } from '@app/core/domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalEventHandler implements EventHandler {
  private subscriptions: Map<
    string,
    ((event: DomainEvent<object>) => Promise<void>)[]
  > = new Map();

  publishEvents(events: DomainEvent<object>[]): void {
    events.forEach((event) => {
      if (this.subscriptions.has(event.name)) {
        this.subscriptions.get(event.name).forEach((subscriber) => {
          subscriber(event);
        });
      }
    });
  }

  subscribe(
    eventName: string,
    callback: (event: DomainEvent<object>) => Promise<void>,
  ): { unsubscribe: () => void } {
    if (!this.subscriptions.has(eventName))
      this.subscriptions.set(eventName, []);
    this.subscriptions.get(eventName).push(callback);
    return {
      unsubscribe: () => {
        this.subscriptions.set(
          eventName,
          this.subscriptions.get(eventName).filter((cb) => cb !== callback),
        );
      },
    };
  }
}
