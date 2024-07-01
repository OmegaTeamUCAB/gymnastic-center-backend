import { ApiProperty } from '@nestjs/swagger';

class AnswerResponse {
  @ApiProperty()
  instructorName: string;

  @ApiProperty({
    nullable: true,
  })
  instructorImage?: string;

  @ApiProperty()
  answer: string;
}

export class CommentOrQuestionResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: string;

  @ApiProperty({
    nullable: true,
    description: 'Just in blog comments',
  })
  userId?: string;

  @ApiProperty({
    nullable: true,
  })
  userImage: string;

  @ApiProperty({
    nullable: true,
    description: 'Just in blog comments',
  })
  countLikes?: number;

  @ApiProperty({
    nullable: true,
    description: 'Just in blog comments',
  })
  countDislikes?: number;

  @ApiProperty({
    nullable: true,
    description: 'Just in blog comments',
  })
  userLiked?: boolean;

  @ApiProperty({
    nullable: true,
    description: 'Just in blog comments',
  })
  userDisliked?: boolean;

  @ApiProperty({
    type: () => AnswerResponse,
    nullable: true,
    description: 'Just in lesson questions',
  })
  answer?: AnswerResponse;

  @ApiProperty()
  body: string;

  @ApiProperty()
  date: Date;
}
