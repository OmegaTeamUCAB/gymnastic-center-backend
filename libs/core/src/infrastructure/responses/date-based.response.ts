import { ApiProperty } from '@nestjs/swagger';

export class DateBasedResponse {
  @ApiProperty({
    type: Date,
    description: 'The date of the response',
  })
  date: Date;
}
