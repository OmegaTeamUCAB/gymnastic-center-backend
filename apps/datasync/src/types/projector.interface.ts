import { EventType } from './event.type';

export interface Projector {
  project(event: EventType): Promise<void>;
  clear(): Promise<void>;
}
