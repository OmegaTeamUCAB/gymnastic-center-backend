import { Entity } from '../entities/entity';
import { ValueObject } from '../value-objects/value-object';
import { DomainEvent } from '../events/domain-event';

export abstract class AggregateRoot<
  T extends ValueObject<T>,
> extends Entity<T> {
  private events: DomainEvent[] = [];

  protected constructor(id: T) {
    super(id);
  }

  protected abstract validateState(): void;

  pullEvents(): DomainEvent[] {
    const events = this.events;
    this.events = [];
    return events;
  }

  protected hydrate(history: DomainEvent[]): void {
    if (history.length === 0) throw new Error('No events to replay');
    history.forEach((event) => this.apply(event, true));
  }

  protected apply(event: DomainEvent, fromHistory: boolean = false): void {
    const handler = this.getEventHandler(event);
    if (!handler) throw new Error(`No handler for event: ${event.name}`);
    if (!fromHistory) this.events.push(event);
    handler.call(this, event.context);
    this.validateState();
  }

  protected getEventHandler(event: DomainEvent): Function | undefined {
    const handler = `on${event.name}`;
    return this[handler];
  }
}
