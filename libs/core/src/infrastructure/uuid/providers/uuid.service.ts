import { Injectable } from '@nestjs/common';

@Injectable()
export class UUIDService {
  generateUUID(): string {
    return uuidv4();
  }

  static generateId(): string {
    return uuidv4();
  }
}
