import { Module } from '@nestjs/common';
import { JwtClass } from './providers/jwt.service';

@Module({
  imports: [],
  controllers: [],
  providers: [JwtClass],
})
export class JwtModule {}
