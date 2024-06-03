import { ApiProperty } from '@nestjs/swagger';

export class CourseLeanResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  image: string;

  @ApiProperty({
    description: 'Category name',
  })
  category: string;

  @ApiProperty({
    description: 'Trainer name',
  })
  trainer: string;

  @ApiProperty({
    type: () => Date,
    example: new Date(),
  })
  date: Date;
}
