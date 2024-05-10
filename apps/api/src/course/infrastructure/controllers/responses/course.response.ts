import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponse } from 'apps/api/src/category/infrastructure/controllers/responses';
import { InstructorResponse } from 'apps/api/src/instructor/infrastructure/responses/instructor.response';

export class CourseResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  weeks: number;

  @ApiProperty()
  minutes: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty({
    type: () => [CategoryResponse],
  })
  category: CategoryResponse;

  @ApiProperty({
    type: () => InstructorResponse,
  })
  instructor: InstructorResponse;

  @ApiProperty({
    type: () => [LessonResponse],
  })
  lessons: LessonResponse[];

  @ApiProperty({
    type: () => Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: () => Date,
    example: new Date(),
  })
  updatedAt: Date;
}

export class LessonResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    nullable: true,
  })
  content: string;

  @ApiProperty({
    nullable: true,
  })
  videoUrl: string;

  @ApiProperty({
    nullable: true,
  })
  imageUrl: string;

  @ApiProperty({
    type: () => [CommentResponse],
  })
  comments: CommentResponse[];
}

export class CommentResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: string;

  @ApiProperty()
  content: string;

  @ApiProperty({
    type: () => Date,
    example: new Date(),
  })
  createdAt: Date;
}
