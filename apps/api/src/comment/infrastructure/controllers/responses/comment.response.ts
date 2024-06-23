import { ApiProperty } from '@nestjs/swagger';

export class CommentResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: string;

  @ApiProperty({
    nullable: true,
  })
  userId: string;

  @ApiProperty({
    nullable: true,
  })
  userImage: string;

  @ApiProperty()
  countLikes: number;

  @ApiProperty()
  countDislikes: number;

  @ApiProperty()
  userLiked: boolean;

  @ApiProperty()
  userDisliked: boolean;

  @ApiProperty()
  body: string;

  @ApiProperty()
  date: Date;
}
