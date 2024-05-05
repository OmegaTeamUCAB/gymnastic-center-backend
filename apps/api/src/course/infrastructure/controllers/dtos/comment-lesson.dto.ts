import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CommentLessonDto {
  @IsString()
  @IsUUID()
  @ApiProperty()
  courseId: string;

  @IsString()
  @IsUUID()
  @ApiProperty()
  lessonId: string;

  @IsString()
  @IsUUID()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;
}
