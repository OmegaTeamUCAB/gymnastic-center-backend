import { IdGenerator } from '@app/core/application/id/id-generator.interface';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UUIDService implements IdGenerator<string>{
  generateId(): string {
    return uuidv4();
  }

  static generateId(): string {
    return uuidv4();
  }
}
