export type EventType<T = object> = {
  dispatcherId: string;
  context: T;
  name: string;
};
