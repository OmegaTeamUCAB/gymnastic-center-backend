import { ITimer } from '@app/core/application/timer/timer.interface';

export class NativeTimer implements ITimer {
  private startTime: number;

  start(): void {
    this.startTime = Date.now();
  }

  stop(): number {
    return Date.now() - this.startTime;
  }
}
