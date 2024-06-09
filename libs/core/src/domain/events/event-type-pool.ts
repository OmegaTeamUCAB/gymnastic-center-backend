import { DomainEvent } from './domain-event';
import { ClassType } from '@app/core/utils';

export class EventTypePool {
  private static readonly eventClsMap = new Map<string, any>();

  static add(eventType: ClassType<DomainEvent>): void {
    this.eventClsMap.set(eventType.name, eventType);
  }

  static get<T extends DomainEvent>(eventTypeName: string): ClassType<T> {
    const eventType = this.eventClsMap.get(eventTypeName);
    if (!eventType) throw new Error(`Event "${eventTypeName}" not registered`);
    return eventType;
  }
}

export const RegisterEventClass: ClassDecorator = (eventType: any) => {
  EventTypePool.add(eventType);
};
