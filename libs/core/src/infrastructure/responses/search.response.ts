import { ApiProperty } from '@nestjs/swagger';

export class SearchResponse {
  @ApiProperty({
    type: () => [CourseSearchResponse],
  })
  courses: CourseSearchResponse[];

  @ApiProperty({
    type: () => [BlogSearchResponse],
  })
  blogs: BlogSearchResponse[];
}

class CourseSearchResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    example: 'tag1 tag2 tag3',
  })
  tags: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  instructorName: string;
}

class BlogSearchResponse extends CourseSearchResponse {
  @ApiProperty()
  content: string;
}
