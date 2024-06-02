import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({
    type: 'string',
    format: 'base64',
    required: false,
    nullable: true,
  })
  image?: string;
}
