import { IdGenerator } from '@app/core';

export class idGeneratorMock implements IdGenerator<string> {
  generateId(): string {
    return '5efb0d66-7e21-46e8-97b6-6fc0443e81c2';
  }
}
