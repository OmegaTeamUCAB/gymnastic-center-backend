import { ApiProperty } from '@nestjs/swagger';

export class ProgressLeanResponse {
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

  @ApiProperty()
  percent: number;
}
