import { Injectable } from '@nestjs/common';
import { ICrypto } from '@app/core/application/crypto/crypto.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements ICrypto{
  async hash(password: string, saltOrRounds: string | number): Promise<string> {
    return bcrypt.hash(password, saltOrRounds);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }
}