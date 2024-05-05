import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenGenerator } from '../../application/token/token-generator.interface';

type Payload = { id: string };

@Injectable()
export class JwtGenerator implements TokenGenerator<string, Payload> {
  constructor(private jwtService: JwtService) {}

  public generateToken(payload: Payload): string {
    return this.jwtService.sign(payload);
  }
}
