import { ApiProperty } from '@nestjs/swagger';

export class BlogLeanResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  images: string[];

  @ApiProperty({
    description: 'Category name',
  })
  category: string;

  @ApiProperty({
    description: 'Trainer name',
  })
  trainer: string;

  @ApiProperty()
  date: Date;
}
