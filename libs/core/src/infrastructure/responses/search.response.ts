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

  @ApiProperty()
  image: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  trainer: string;
}

class BlogSearchResponse extends CourseSearchResponse {
  
}
