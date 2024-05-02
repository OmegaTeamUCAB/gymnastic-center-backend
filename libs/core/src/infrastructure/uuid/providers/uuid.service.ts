import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { IdGenerator } from '@app/core/application';

@Injectable()
export class UUIDService implements IdGenerator<string>{
  generateId(): string {
    return uuidv4();
  }

  static generateId(): string {
    return uuidv4();
  }
}
