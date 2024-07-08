import { IdGenerator } from '@app/core';
import { v4 as uuidv4 } from 'uuid';

export class IdGeneratorMock implements IdGenerator<string> {
  generateId(): string {
    return uuidv4();
  }
}
