import { ApiProperty } from '@nestjs/swagger';

export class ProgressResponse {
  @ApiProperty({
    type: () => [LessonProgressResponse],
  })
  lessons: LessonProgressResponse[];

  @ApiProperty()
  percent: number;
}

class LessonProgressResponse {
  @ApiProperty()
  lessonId: string;

  @ApiProperty()
  time: number;

  @ApiProperty()
  percent: number;
}
