export interface DomainEvent<T extends object = object> {
  readonly dispatcherId: string;
  readonly name: string;
  readonly timestamp: Date;
  readonly context: T;
}

export const DomainEventFactory =
  <T extends object>(name: string) =>
  (dispatcherId: string, context: T): DomainEvent<T> => ({
    dispatcherId,
    name,
    timestamp: new Date(),
    context,
  });
