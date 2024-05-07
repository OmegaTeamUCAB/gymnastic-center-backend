import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  blogId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;
}
