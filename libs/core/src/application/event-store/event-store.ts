import { DomainEvent } from '@app/core/domain';

export interface EventStore {
  append(dispatcherId: string, events: DomainEvent[]): Promise<void>;
  getEventsByDispatcherId(dispatcherId: string): Promise<DomainEvent[]>;
  getEventsByDateRange(from?: Date, until?: Date): Promise<DomainEvent[]>;
}
