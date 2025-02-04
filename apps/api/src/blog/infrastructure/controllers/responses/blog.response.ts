import { ApiProperty } from '@nestjs/swagger';

export class BlogTrainerResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    nullable: true,
  })
  image?: string;
}

export class BlogResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  description: string;

  @ApiProperty({
    description: 'Category name',
  })
  category: string;

  @ApiProperty({
    type: () => BlogTrainerResponse,
  })
  trainer: BlogTrainerResponse;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  comments: number;
}
