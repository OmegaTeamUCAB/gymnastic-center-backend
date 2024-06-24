import { ApiProperty } from '@nestjs/swagger';

export class CountResponse {
  @ApiProperty()
  count: number;
}
