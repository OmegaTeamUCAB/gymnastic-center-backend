import { Injectable } from '@nestjs/common';
import { CodeGenerator } from '@app/core';

@Injectable()
export class FourDigitCodeGeneratorService implements CodeGenerator<string> {
  generateRandomCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
