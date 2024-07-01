import { ApiProperty } from '@nestjs/swagger';

export class CourseTrainerResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    nullable: true,
  })
  image?: string;
}

export class CourseResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  durationWeeks: number;

  @ApiProperty()
  durationMinutes: number;

  @ApiProperty()
  image: string;

  @ApiProperty({
    description: 'Category name',
  })
  category: string;

  @ApiProperty({
    type: () => CourseTrainerResponse,
  })
  trainer: CourseTrainerResponse;

  @ApiProperty({
    type: () => [LessonResponse],
  })
  lessons: LessonResponse[];

  @ApiProperty({
    type: () => Date,
    example: new Date(),
  })
  date: Date;
}

export class LessonResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  video: string;
}
