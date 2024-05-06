import { ApiProperty } from '@nestjs/swagger';

export class SuccessBasedResponse {
  @ApiProperty({
    type: Boolean,
    description: 'Indicates if the request was successful',
  })
  success: boolean;
}
