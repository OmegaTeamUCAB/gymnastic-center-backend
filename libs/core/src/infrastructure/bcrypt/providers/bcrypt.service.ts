import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CryptoService } from '@app/core/application';

@Injectable()
export class BcryptService implements CryptoService {
  async hash(text: string): Promise<string> {
    return bcrypt.hash(text, 10);
  }

  async compare(text: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(text, hashedText);
  }
}
