import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    description: 'Category icon url',
    example: 'https://example.com/icon.png',
  })
  icon: string;
}
