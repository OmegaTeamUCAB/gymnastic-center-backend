import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UUIDService {
  generateUUID(): string {
    return uuidv4();
  }

  static generateUUID(): string {
    return uuidv4();
  }
}
