import { DomainEvent } from '@app/core/domain';
import { Result } from '@app/core/utils';

export interface EventStore {
  appendEvents(stream: string, events: DomainEvent[]): Promise<Result<void>>;
  getEventsByStream(stream: string): Promise<Result<DomainEvent[]>>;
  getEventsByDateRange(
    from?: Date,
    until?: Date,
  ): Promise<Result<DomainEvent[]>>;
}
