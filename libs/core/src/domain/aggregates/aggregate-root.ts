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

  pullEvents(): DomainEvent[] {
    const events = this.events;
    this.events = [];
    return events;
  }

  protected pushEvent(event: DomainEvent): void {
    this.validateState();
    this.events.push(event);
  }

  abstract validateState(): void;
}
