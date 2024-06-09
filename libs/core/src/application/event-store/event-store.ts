import { DomainEvent } from '@app/core/domain';

export interface EventStore {
  appendEvents(stream: string, events: DomainEvent[]): Promise<void>;
  getEventsByStream(stream: string): Promise<DomainEvent[]>;
  getEventsByDateRange(from?: Date, until?: Date): Promise<DomainEvent[]>;
}
