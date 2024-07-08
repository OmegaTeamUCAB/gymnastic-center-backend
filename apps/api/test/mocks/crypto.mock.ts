import { CryptoService } from '@app/core';

export class CryptoMock implements CryptoService {
  async hash(text: string): Promise<string> {
    return text;
  }

  async compare(text: string, hashedText: string): Promise<boolean> {
    return text === hashedText;
  }
}
