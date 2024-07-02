import { ApiProperty } from '@nestjs/swagger';

export class TrendingProgressResponse {
  @ApiProperty()
  courseId: string;

  @ApiProperty()
  courseTitle: string;

  @ApiProperty()
  percent: number;

  @ApiProperty({
    type: () => Date,
    example: new Date(),
  })
  lastTime: Date;
}
